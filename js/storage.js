/**
 * FIELD MANUAL — by Lalo
 * Clone library persistence. Native ES module; no backend or dependencies.
 *
 * Controller contract: createStorage({key}) -> {load(), save(clones)}.
 * The on-disk format intentionally remains a plain JSON array so existing
 * libraries written by app.js v1 continue to work without migration.
 */
export const DEFAULT_KEY = 'field-manual.lalo.clones.v1';
export const MAX_CLONES = 2000;
const PLANTS = new Set(['hemp', 'corn', 'potato', 'pumpkin', 'berry', 'other']);
const GENES = /^[GYHWX]{6}$/;

export class StorageError extends Error {
  constructor(code, message, cause) {
    super(message, { cause });
    this.name = 'StorageError';
    this.code = code;
  }
}

function fail(message) {
  throw new StorageError('INVALID_LIBRARY', message);
}

function cleanLabel(label) {
  if (typeof label !== 'string') fail('A clone label must be a string.');
  const value = label.trim().replace(/\s+/g, ' ');
  if (value.length > 60) fail('A clone label cannot exceed 60 characters.');
  return value;
}

/** Validate and copy data rather than retaining mutable caller references. */
function validateLibrary(clones) {
  if (!Array.isArray(clones)) fail('The clone library must be an array.');
  if (clones.length > MAX_CLONES) fail(`The library limit is ${MAX_CLONES} clones.`);
  const identities = new Set();
  const ids = new Set();
  return clones.map((clone, index) => {
    if (!clone || typeof clone !== 'object' || Array.isArray(clone)) {
      fail(`Clone ${index + 1} is not an object.`);
    }
    const { id, plant, genes, createdAt } = clone;
    if (typeof id !== 'string' || !id.trim() || ids.has(id)) {
      fail(`Clone ${index + 1} has a missing or duplicate ID.`);
    }
    if (!PLANTS.has(plant)) fail(`Clone ${index + 1} has an unknown plant type.`);
    if (typeof genes !== 'string' || !GENES.test(genes)) {
      fail(`Clone ${index + 1} must contain exactly six valid genes.`);
    }
    const label = cleanLabel(clone.label);
    const namedSpecies = plant === 'berry' || plant === 'other';
    if (namedSpecies && !label) fail(`Clone ${index + 1} needs an exact species label.`);
    const identity = JSON.stringify([plant, namedSpecies ? label.toLowerCase() : '', genes]);
    if (identities.has(identity)) fail(`Duplicate genotype in clone ${index + 1}.`);
    if (typeof createdAt !== 'string' || !Number.isFinite(Date.parse(createdAt))) {
      fail(`Clone ${index + 1} has an invalid creation date.`);
    }
    ids.add(id);
    identities.add(identity);
    return { id, plant, label, genes, createdAt };
  });
}

function storageFailure(error, operation) {
  if (error instanceof StorageError) return error;
  if (error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
    return new StorageError('QUOTA_EXCEEDED', 'Browser storage is full. Export your library before leaving.', error);
  }
  return new StorageError('STORAGE_UNAVAILABLE', `Cannot ${operation} the local clone library. Browser storage may be blocked.`, error);
}

/**
 * Synchronous adapter matching app.js. An optional Storage-compatible object
 * may be supplied for tests. Errors are propagated so the controller can
 * warn about unsaved data rather than falsely report successful persistence.
 */
export function createStorage({ key = DEFAULT_KEY, storage } = {}) {
  if (typeof key !== 'string' || !key.trim()) {
    throw new TypeError('A non-empty storage key is required.');
  }

  function getStorage() {
    const backend = storage === undefined ? globalThis.localStorage : storage;
    if (!backend || typeof backend.getItem !== 'function' || typeof backend.setItem !== 'function') {
      throw new StorageError('STORAGE_UNAVAILABLE', 'Browser storage is not available.');
    }
    return backend;
  }

  function load() {
    let raw;
    try {
      raw = getStorage().getItem(key);
    } catch (error) {
      throw storageFailure(error, 'read');
    }
    if (raw === null) return [];
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      throw new StorageError('CORRUPT_LIBRARY', 'Saved clone data is not valid JSON.', error);
    }
    return validateLibrary(data);
  }

  function save(clones) {
    // Complete all validation before touching the existing storage value.
    const payload = JSON.stringify(validateLibrary(clones));
    try {
      // One setItem call; a failed quota-limited write leaves the old value intact.
      getStorage().setItem(key, payload);
    } catch (error) {
      throw storageFailure(error, 'save');
    }
  }

  return Object.freeze({ load, save });
}
