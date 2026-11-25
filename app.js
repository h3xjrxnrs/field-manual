/**
 * FIELD MANUAL — by Lalo
 * Application controller / native ES modules / GitHub Pages compatible.
 * No backend, game-process access, network telemetry or screen uploads.
 * Optional modules (relative to this file):
 *   js/storage.js: createStorage({key}) -> {load(): Clone[], save(Clone[]): void}
 *   js/scanner.js: detectGenes(canvas, {signal}) -> Promise<null|{genes,confidence}>
 *   js/genetics.js: findBreedingPlan({clones,target,maxGenerations,signal})
 *      -> Promise<{message,steps:string[],layout?:{cell,role,label}[]}>
 * Optional modules are discovered at startup and can be added without changing
 * this controller. A missing module never enables a nonfunctional tool.
 */
const $ = id => document.getElementById(id);
const ui = Object.fromEntries([
  'scanner-status','capture-viewport','capture-video','capture-overlay','capture-placeholder',
  'start-capture','stop-capture','scan-frame','image-input','capture-help','detected-genes',
  'detection-confidence','clone-count','clone-form','plant-type','plant-label','clone-genes',
  'add-clone','clone-form-message','clone-list','clone-empty','export-clones','clear-clones',
  'breeder-form','target-genes','breeding-depth','calculate-breeding','breeding-message',
  'breeding-steps','planter-preview','planter-grid','auto-save','sound-enabled','breeding-options','selected-plan','selected-plan-title','selected-plan-meta','recipe-cards'
].map(id => [id, $(id)]));
const el = id => ui[id];
const KEY = 'field-manual.lalo.clones.v1';
const PLANTS = new Set(['hemp','corn','potato','pumpkin','berry','other']);
const MAX_CLONES = 2000;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const SCAN_INTERVAL = 700;
const AUTO_CONFIDENCE = 0.90;
const cleanGenes = value => String(value ?? '').trim().toUpperCase();
const validGenes = value => /^[GYHWX]{6}$/.test(value);
const cleanLabel = value => String(value ?? '').trim().replace(/\s+/g,' ').slice(0,60);
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const speciesKey = (plant,label) => ['berry','other'].includes(plant) ? `${plant}:${cleanLabel(label).toLowerCase()}` : plant;
const cloneKey = c => `${speciesKey(c.plant,c.label)}:${c.genes}`;
const plantName = c => c.label || ({hemp:'Hemp',corn:'Corn',potato:'Potato',pumpkin:'Pumpkin',berry:'Berry',other:'Other'})[c.plant];
const message = (id, text) => { el(id).textContent = text; };
const disable = (ids,value) => ids.forEach(id => { el(id).disabled = value; });
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const state = {
  clones: [], storage: null, storageWarning: '', scanner: null, genetics: null,
  stream: null, image: false, starting: false, sourceVersion: 0,
  captureAbort: null, scanBusy: false, scanTimer: null, lastDetection: null,
  candidate: '', candidateCount: 0, acceptedKey: null, planOptions: [], scanFailures: 0, planAbort: null, planBusy: false
};

// Short original synthesized sounds; nothing is downloaded or recorded.
let audioContext;
function unlockAudio() {
  if (!el('sound-enabled').checked) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if (audioContext.state === 'suspended') audioContext.resume().catch(()=>{});
  } catch { /* Audio is optional. */ }
}
function sound(kind='success') {
  if (!el('sound-enabled').checked || audioContext?.state !== 'running') return;
  try {
    const notes = kind==='error' ? [270,190] : kind==='select' ? [560] : kind==='remove' ? [480,320] : [430,710];
    const t=audioContext.currentTime;
    notes.forEach((hz,i)=>{
      const start=t+i*.075, osc=audioContext.createOscillator(), gain=audioContext.createGain();
      osc.type='sine'; osc.frequency.setValueAtTime(hz*.72,start); osc.frequency.exponentialRampToValueAtTime(hz,start+.035);
      gain.gain.setValueAtTime(.0001,start); gain.gain.exponentialRampToValueAtTime(.065,start+.012); gain.gain.exponentialRampToValueAtTime(.0001,start+.13);
      osc.connect(gain);gain.connect(audioContext.destination);osc.start(start);osc.stop(start+.14);
    });
  } catch { /* No impact on the scanner. */ }
}
function feedback(text,kind='error') { libraryMessage(text);sound(kind); }
function normalizeClones(raw) {
  if (!Array.isArray(raw)) throw new Error('Invalid clone library format.');
  const unique = new Map();
  for (const item of raw) {
    if (!item || !PLANTS.has(item.plant)) continue;
    const genes = cleanGenes(item.genes), label = cleanLabel(item.label);
    if (!validGenes(genes) || (['berry','other'].includes(item.plant) && !label)) continue;
    const clone = {id: uid(), plant:item.plant, label, genes,
      createdAt: Number.isFinite(Date.parse(item.createdAt)) ? item.createdAt : new Date().toISOString()};
    // IDs need only be unique within this session; the genotype is the identity.
    if (!unique.has(cloneKey(clone))) unique.set(cloneKey(clone),clone);
    if (unique.size >= MAX_CLONES) break;
  }
  return [...unique.values()];
}
function browserStorage() {
  return {
    load() { const value = localStorage.getItem(KEY); return value === null ? [] : JSON.parse(value); },
    save(clones) { localStorage.setItem(KEY,JSON.stringify(clones)); }
  };
}
function saveLibrary() {
  try { state.storage.save(state.clones); state.storageWarning = ''; return true; }
  catch (error) {
    console.warn('Field Manual: local save unavailable.', error);
    state.storageWarning = 'Browser storage is unavailable. Export your library before leaving this page.';
    return false;
  }
}
function libraryMessage(text) {
  message('clone-form-message', [text,state.storageWarning].filter(Boolean).join(' '));
}
function geneStrip(genes) {
  const strip = make('span','gene-strip');
  strip.setAttribute('aria-label',`Genes: ${genes.split('').join(' ')}`);
  for (const gene of genes) {
    const chip = make('span','gene-chip',gene);
    chip.dataset.gene = gene;
    chip.setAttribute('aria-hidden','true');
    strip.append(chip);
  }
  return strip;
}
function selectedClones() {
  const plant = el('plant-type').value, label = cleanLabel(el('plant-label').value);
  if (['berry','other'].includes(plant) && !label) return [];
  return state.clones.filter(c => speciesKey(c.plant,c.label) === speciesKey(plant,label));
}
function updateBreederControls() {
  const ready = typeof state.genetics === 'function';
  disable(['target-genes','breeding-depth'],!ready || state.planBusy);
  el('calculate-breeding').disabled = !ready || state.planBusy || selectedClones().length === 0;
}
function renderClones() {
  const list = el('clone-list');
  const nodes = document.createDocumentFragment();
  state.clones.forEach((clone,index) => {
    const row = make('li');
    const name = make('span','',`${String(index+1).padStart(2,'0')} / ${plantName(clone)}`);
    const remove = make('button','button button-secondary','Remove');
    remove.type = 'button';
    remove.dataset.cloneId = clone.id;
    remove.setAttribute('aria-label',`Remove ${plantName(clone)} ${clone.genes}`);
    row.append(name,geneStrip(clone.genes),remove);
    nodes.append(row);
  });
  list.replaceChildren(nodes);
  const count = state.clones.length;
  message('clone-count',`${count} ${count === 1 ? 'clone' : 'clones'}`);
  el('clone-empty').hidden = count > 0;
  disable(['export-clones','clear-clones'],count === 0);
  updateBreederControls();
}
function addClone(event) {
  event.preventDefault();
  storeClone(cleanGenes(el('clone-genes').value),false);
}
function storeClone(genes,automatic=false) {
  const plant=el('plant-type').value,label=cleanLabel(el('plant-label').value);
  if (!validGenes(genes)||!PLANTS.has(plant)) {if(!automatic)feedback('Enter exactly six genes using G, Y, H, W and X.');return false;}
  if (['berry','other'].includes(plant)&&!label) {
    if(!automatic)el('plant-label').focus();
    libraryMessage('Enter the exact plant species before adding clones.'); if(!automatic)sound('error');return false;
  }
  const clone={id:uid(),plant,label,genes,createdAt:new Date().toISOString()};
  if(state.clones.some(c=>cloneKey(c)===cloneKey(clone))) {if(!automatic)feedback('This genotype is already saved for this species.');return false;}
  if(state.clones.length>=MAX_CLONES) {libraryMessage('Library limit reached. Export and remove unused clones first.');if(!automatic)sound('error');return false;}
  state.clones.push(clone);const saved=saveLibrary();
  if(!automatic || el('clone-genes').value===genes)el('clone-genes').value='';
  invalidatePlan();renderClones();
  libraryMessage(`${automatic?'Auto-added':'Added'} ${plantName(clone)} / ${genes}${saved?'.':' (session only).'}`);
  sound(saved?'success':'error');return true;
}
function removeClone(event) {
  const button = event.target.closest('button[data-clone-id]');
  if (!button) return;
  const index = state.clones.findIndex(c => c.id === button.dataset.cloneId);
  if (index < 0) return;
  const [removed] = state.clones.splice(index,1);
  saveLibrary(); invalidatePlan(); renderClones();
  libraryMessage(`Removed ${removed.genes}.`); sound('remove');
}
function clearClones() {
  if (!state.clones.length || !window.confirm('Clear every saved clone? Export a backup first if needed.')) return;
  state.clones = [];
  saveLibrary(); invalidatePlan(); renderClones();
  libraryMessage('Clone library cleared.'); sound('remove');
}
function exportClones() {
  if (!state.clones.length) return;
  const payload = {format:'field-manual-clones',version:1,exportedAt:new Date().toISOString(),clones:state.clones};
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const link = make('a');
  link.href = url;
  link.download = `field-manual-clones-${new Date().toISOString().slice(0,10)}.json`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  libraryMessage('Library exported as JSON.'); sound();
}

// Screen capture and screenshot import. The frame canvas is never sent to a server.
function scannerStatus(text, kind = 'idle') {
  const node = el('scanner-status'); node.textContent = text; node.dataset.state = kind;
}
function supportsCapture() {
  return window.isSecureContext && typeof navigator.mediaDevices?.getDisplayMedia === 'function';
}
function updateCaptureControls() {
  const hasSource = Boolean(state.stream || state.image);
  el('start-capture').disabled = state.starting || Boolean(state.stream) || !supportsCapture();
  el('stop-capture').disabled = !hasSource && !state.starting;
  el('scan-frame').disabled = !hasSource || !state.scanner || state.scanBusy;
  el('image-input').disabled = false;
}
function resetDetection() {
  state.lastDetection = null; state.acceptedKey = null; state.candidate = ''; state.candidateCount = 0; state.scanFailures = 0;
  message('detected-genes','No genes detected.'); message('detection-confidence','');
}
function stopSource({quiet=false} = {}) {
  state.sourceVersion++;
  state.captureAbort?.abort(); state.captureAbort = null;
  clearTimeout(state.scanTimer); state.scanTimer = null;
  const stream = state.stream; state.stream = null; state.image = false;
  state.starting = false; state.scanBusy = false;
  stream?.getTracks().forEach(track => track.stop());
  const video = el('capture-video'); video.pause(); video.srcObject = null; video.hidden = true;
  const canvas = el('capture-overlay'); canvas.hidden = true; canvas.width = 1; canvas.height = 1;
  el('capture-placeholder').hidden = false;
  resetDetection(); updateCaptureControls();
  if (!quiet) scannerStatus(state.scanner ? 'Ready' : 'Preview only');
}
async function startCapture() {
  if (!supportsCapture() || state.starting || state.stream) return;
  stopSource({quiet:true});
  const version = state.sourceVersion;
  state.starting = true; updateCaptureControls(); scannerStatus('Waiting for permission');
  let stream;
  try {
    // Must be called directly from the user's click, before any awaited work.
    stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
    if (version !== state.sourceVersion) { stream.getTracks().forEach(t => t.stop()); return; }
    state.stream = stream;
    state.captureAbort = new AbortController();
    const video = el('capture-video');
    stream.getVideoTracks().forEach(track => track.addEventListener('ended',() => {
      if (state.stream === stream) stopSource();
    },{once:true}));
    video.srcObject = stream;
    video.hidden = false; el('capture-placeholder').hidden = true;
    await video.play();
    if (version !== state.sourceVersion) return;
    state.starting = false;
    scannerStatus(state.scanner ? 'Screen shared' : 'Preview only','active');
    message('detection-confidence',state.scanner ? 'Show a plant gene tooltip in the shared window.' : 'Screen sharing works. Recognition module is not installed yet.');
    updateCaptureControls(); scheduleScan(); sound('select');
  } catch (error) {
    if (version !== state.sourceVersion) { stream?.getTracks().forEach(t => t.stop()); return; }
    stopSource({quiet:true});
    const cancelled = ['NotAllowedError','AbortError'].includes(error?.name);
    scannerStatus(cancelled ? 'Sharing cancelled' : 'Capture unavailable',cancelled?'idle':'error');
    message('detection-confidence',cancelled ? 'Select your Rust window to try again.' : 'The browser could not start capture. Try a supported desktop browser or a screenshot.');
  }
}
async function importImage(event) {
  const file = event.target.files?.[0]; event.target.value = '';
  if (!file) return;
  if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > MAX_IMAGE_BYTES) {
    message('detection-confidence','Choose a PNG, JPEG or WebP screenshot up to 25 MB.'); return;
  }
  stopSource({quiet:true});
  const version = state.sourceVersion;
  scannerStatus('Opening screenshot');
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    if (version !== state.sourceVersion) return;
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('Image dimensions are too large.');
    const canvas = el('capture-overlay');
    const scale = Math.min(1,4096 / Math.max(bitmap.width,bitmap.height));
    canvas.width = Math.max(1,Math.round(bitmap.width*scale));
    canvas.height = Math.max(1,Math.round(bitmap.height*scale));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
    canvas.hidden = false; el('capture-placeholder').hidden = true;
    state.image = true; state.captureAbort = new AbortController();
    scannerStatus(state.scanner?'Screenshot ready':'Preview only','active');
    updateCaptureControls();
    if (state.scanner) await scanFrame({manual:true});
    else message('detection-confidence','Screenshot loaded locally. Automatic recognition is not available yet.');
  } catch (error) {
    if (version !== state.sourceVersion) return;
    stopSource({quiet:true}); scannerStatus('Image unavailable','error');
    message('detection-confidence','Could not decode this screenshot. Try another image.');
  } finally { bitmap?.close(); }
}
function snapshot() {
  const source = state.image ? el('capture-overlay') : el('capture-video');
  const width = state.image ? source.width : source.videoWidth;
  const height = state.image ? source.height : source.videoHeight;
  if (!width || !height || (!state.image && source.readyState < 2)) return null;
  const scale = Math.min(1,4096/Math.max(width,height));
  // Keep a separate frame for each scan so a stopped/restarted capture cannot
  // mutate the input of a detector which is still resolving its previous job.
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1,Math.round(width*scale)); canvas.height = Math.max(1,Math.round(height*scale));
  canvas.getContext('2d').drawImage(source,0,0,canvas.width,canvas.height);
  return canvas;
}
function showDetection(result, manual) {
  const genes=cleanGenes(result?.genes), confidence=result?.confidence;
  if(!validGenes(genes)||!Number.isFinite(confidence)||confidence<0||confidence>1){
    state.candidate='';state.candidateCount=0;state.acceptedKey=null;
    if(manual)message('detection-confidence','No valid six-gene sequence found in this frame.');return;
  }
  // A low-scoring frame must never contribute to a stable auto-add streak.
  if(confidence>=AUTO_CONFIDENCE){state.candidateCount=state.candidate===genes?state.candidateCount+1:1;state.candidate=genes;}
  else {state.candidate='';state.candidateCount=0;}
  if(!manual&&state.candidateCount<2)return;
  const previous=state.lastDetection;state.lastDetection=genes;
  el('detected-genes').replaceChildren(geneStrip(genes));
  const score=`Recognition score: ${Math.round(confidence*100)}% (heuristic).`;
  const input=el('clone-genes');
  if(state.stream&&el('auto-save').checked&&state.candidateCount>=2){
    const plant=el('plant-type').value,label=cleanLabel(el('plant-label').value);
    if(['berry','other'].includes(plant)&&!label){message('detection-confidence',score+' Select an exact species before auto-adding.');return;}
    const key=cloneKey({plant,label,genes});
    if(state.acceptedKey!==key){
      state.acceptedKey=key;
      const exists=state.clones.some(c=>cloneKey(c)===key);
      const added=!exists&&storeClone(genes,true);
      message('detection-confidence',score+(added?' Auto-added. Verify against Rust.':exists?' Already in library.':' Not added; check library status.'));
    }
    return;
  }
  message('detection-confidence',score+' Verify all six genes before adding.');
  if((manual||previous!==genes)&&(!input.value||(input.value===previous&&document.activeElement!==input)))input.value=genes;
  if(previous!==genes)sound('select');
}
async function scanFrame({manual=false} = {}) {
  if (!state.scanner || state.scanBusy || (!state.stream && !state.image)) return;
  const version = state.sourceVersion;
  let canvas;
  try { canvas = snapshot(); } catch { return; }
  if (!canvas) return;
  state.scanBusy = true; updateCaptureControls();
  try {
    const result = await state.scanner(canvas,{signal:state.captureAbort?.signal});
    if (version !== state.sourceVersion) return;
    state.scanFailures = 0;
    scannerStatus(state.image?'Screenshot ready':'Scanning','active');
    showDetection(result,manual);
  } catch (error) {
    if (version !== state.sourceVersion || error?.name === 'AbortError') return;
    state.scanFailures++;
    scannerStatus('Recognition error','error');
    message('detection-confidence','Recognition failed. Try Scan frame or restart sharing.');
    console.warn('Field Manual: recognition failed.',error);
  } finally {
    canvas.width = 1; canvas.height = 1;
    if (version === state.sourceVersion) { state.scanBusy = false; updateCaptureControls(); }
  }
}
function scheduleScan() {
  clearTimeout(state.scanTimer);
  if (!state.stream || !state.scanner || state.scanFailures >= 3) return;
  const version = state.sourceVersion;
  state.scanTimer = setTimeout(async () => {
    if (version !== state.sourceVersion) return;
    await scanFrame();
    if (version === state.sourceVersion) scheduleScan();
  },SCAN_INTERVAL);
}

// Breeding engine adapter: it never invents a result or mixes plant species.
function resetLayout() {
  el('planter-preview').hidden = true;
  for (const cell of el('planter-grid').children) {
    delete cell.dataset.role; cell.textContent = String(Number(cell.dataset.cell)+1);
  }
}
function invalidatePlan() {
  state.planAbort?.abort(); state.planAbort = null; state.planBusy = false;
  el('breeding-steps').replaceChildren(); el('breeding-options').replaceChildren(); el('recipe-cards').replaceChildren(); el('selected-plan').hidden=true; state.planOptions=[]; resetLayout();
  message('breeding-message',state.genetics ? (selectedClones().length ? `Ready: ${selectedClones().length} saved genotypes of the selected species.` : 'Select a species with saved clones in the library.') : 'The breeding engine will be enabled when its module is installed.');
  updateBreederControls();
}
const profileName={balanced:'Balanced growth & yield',growth:'Fast growth',yield:'High yield',target:'Closest to target',alternative:'Alternative'};
function displayPlan(index,play=true){
  const plan=state.planOptions[index];if(!plan)return;
  for(const [i,card] of [...el('breeding-options').children].entries())card.setAttribute('aria-pressed',String(i===index));
  el('selected-plan').hidden=false;
  el('selected-plan-title').replaceChildren(document.createTextNode(`Option ${index+1} / `),geneStrip(plan.genes));
  message('selected-plan-meta',plan.generations?`${plan.generations} cross${plan.generations===1?'':'es'} · in sequence`:'Already in your library');
  el('breeding-steps').replaceChildren(...plan.steps.map(step=>make('li','',step)));
  const recipes=el('recipe-cards');recipes.replaceChildren();
  if(!plan.recipes?.length)recipes.append(make('p','helper-text','No crossing required. Keep and multiply this clone.'));
  for(const [i,r] of (plan.recipes||[]).entries()){
    const article=make('article','recipe-card');
    const header=make('div','recipe-heading');header.append(make('h6','',`CROSS ${String(i+1).padStart(2,'0')} / ${plan.recipes.length}`),geneStrip(r.result));article.append(header);
    const body=make('div','recipe-body'),grid=make('div','planter-grid recipe-grid');grid.setAttribute('role','group');grid.setAttribute('aria-label',`Cross ${i+1} planter layout`);
    for(const cell of r.layout){const item=make('span');item.dataset.role=cell.role;item.append(make('small','recipe-slot',`#${cell.cell+1}${cell.role==='target'?' / CENTER':cell.role==='donor'?' / DONOR':''}`));if(cell.role==='empty')item.append(make('span','','—'));else item.append(geneStrip(cell.label));grid.append(item);}
    const instructions=make('div','recipe-copy');instructions.append(make('p','','1. Plant the center first: '),geneStrip(r.center),make('p','','2. Before it enters Crossbreed, plant the listed donors in the indicated slots. Keep the other slots empty.'),make('p','','3. Verify the resulting genes and take clones before continuing.'),geneStrip(r.result));
    body.append(grid,instructions);article.append(body);recipes.append(article);
  }
  if(play){sound('select');el('selected-plan').scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
}
function displayOptions(result){
  state.planOptions=result.alternatives?.length?result.alternatives:[result];
  el('breeding-options').replaceChildren(...state.planOptions.map((plan,i)=>{
    const card=make('button','breeding-option');card.type='button';card.setAttribute('aria-pressed','false');
    const traits=plan.traits||Object.fromEntries([...('GYHWX')].map(g=>[g,[...plan.genes].filter(x=>x===g).length]));
    card.append(make('span','option-kicker',`OPTION ${String(i+1).padStart(2,'0')} / ${plan.exact?'EXACT TARGET':profileName[plan.profile]||'BEST FOUND'}`),geneStrip(plan.genes),make('span','option-traits',`${traits.G} Growth · ${traits.Y} Yield · ${traits.H} Hardiness`),make('span','option-meta',`${plan.generations?plan.generations+' cross'+(plan.generations===1?'':'es'):'Already owned'} · ${traits.W+traits.X} negative`));
    card.addEventListener('click',()=>displayPlan(i));return card;
  }));
  displayPlan(0,false);
}
async function calculateBreeding(event) {
  event.preventDefault();
  if (!state.genetics || state.planBusy) return;
  const clones = selectedClones().map(c => ({...c}));
  const target = cleanGenes(el('target-genes').value);
  const maxGenerations = Number(el('breeding-depth').value);
  if (!clones.length || !validGenes(target) || ![1,2,3].includes(maxGenerations)) {
    message('breeding-message','Choose a saved species and a valid six-gene target.'); sound('error'); return;
  }
  invalidatePlan();
  const controller = new AbortController(); state.planAbort = controller; state.planBusy = true;
  updateBreederControls(); message('breeding-message','Searching for breeding options…'); sound('select');
  try {
    const result = await state.genetics({clones,target,maxGenerations,signal:controller.signal});
    if (state.planAbort !== controller || controller.signal.aborted) return;
    if (!result || typeof result.message !== 'string' || !Array.isArray(result.steps) || result.steps.some(s => typeof s !== 'string')) throw new Error('Unexpected breeding result.');
    message('breeding-message',result.message);
    displayOptions(result); sound();
  } catch (error) {
    if (state.planAbort !== controller || controller.signal.aborted) return;
    message('breeding-message','Unable to calculate a plan. Try a smaller library or a lower generation limit.');
    console.warn('Field Manual: breeding engine failed.',error); sound('error');
  } finally {
    if (state.planAbort === controller) { state.planAbort = null; state.planBusy = false; updateBreederControls(); }
  }
}

function bindControls() {
  el('clone-form').addEventListener('submit',addClone);
  for(const form of ['clone-form','breeder-form'])el(form).addEventListener('invalid',()=>sound('error'),true);
  el('clone-list').addEventListener('click',removeClone);
  el('clear-clones').addEventListener('click',clearClones);
  el('export-clones').addEventListener('click',exportClones);
  // Native key filtering plus sanitization for paste, mobile keyboards and IME.
  for(const id of ['clone-genes','target-genes']){
    const input=el(id);
    input.addEventListener('beforeinput',event=>{
      if(event.inputType==='insertText'&&event.data&&!/^[GYHWX]+$/i.test(event.data)){event.preventDefault();sound('error');}
    });
    input.addEventListener('paste',event=>{
      const raw=event.clipboardData?.getData('text');if(raw===undefined)return;
      event.preventDefault();const cleaned=raw.toUpperCase().replace(/[^GYHWX]/g,'');
      const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;
      const available=Math.max(0,6-(input.value.length-(b-a)));input.setRangeText(cleaned.slice(0,available),a,b,'end');
      input.dispatchEvent(new Event('input',{bubbles:true}));if(cleaned.length!==raw.length)sound('error');
    });
    input.addEventListener('input',()=>{
      const raw=input.value, start=input.selectionStart??raw.length;
      input.value=raw.toUpperCase().replace(/[^GYHWX]/g,'').slice(0,6);
      const pos=Math.min(6,raw.slice(0,start).toUpperCase().replace(/[^GYHWX]/g,'').length);input.setSelectionRange(pos,pos);
      if(raw.length!==input.value.length)sound('error');
      if(id==='target-genes')invalidatePlan();
    });
  }
  for(const type of ['pointerdown','keydown','click'])document.addEventListener(type,unlockAudio,{capture:true,passive:true});
  el('sound-enabled').addEventListener('change',()=>{if(el('sound-enabled').checked){unlockAudio();sound('select');}});
  el('auto-save').addEventListener('change',()=>{state.candidate='';state.candidateCount=0;state.acceptedKey=null;sound('select');});
  el('plant-type').addEventListener('change',() => {
    el('plant-label').value = ''; state.candidate='';state.candidateCount=0;state.acceptedKey=null;
    el('plant-label').required = ['berry','other'].includes(el('plant-type').value);
    invalidatePlan(); sound('select');
  });
  el('plant-label').addEventListener('input',()=>{state.candidate='';state.candidateCount=0;state.acceptedKey=null;invalidatePlan();});
  el('breeding-depth').addEventListener('change',()=>{invalidatePlan();sound('select');});
  el('breeder-form').addEventListener('submit',calculateBreeding);
  el('start-capture').addEventListener('click',startCapture);
  el('stop-capture').addEventListener('click',() => {stopSource();sound('remove');});
  el('scan-frame').addEventListener('click',async () => { await scanFrame({manual:true}); scheduleScan(); });
  el('image-input').addEventListener('change',importImage);
  window.addEventListener('pagehide',() => { stopSource({quiet:true}); state.planAbort?.abort(); });
  window.addEventListener('pageshow',event => { if (event.persisted) { stopSource(); invalidatePlan(); } });
}

async function optionalModule(path) {
  // Missing files are expected during staged development. Real module errors
  // are reported without preventing the rest of the site from working.
  try { return await import(path); }
  catch (error) { console.info(`Field Manual: optional module ${path} not loaded.`,error.message); return null; }
}
async function boot() {
  bindControls();
  state.storage = browserStorage();
  try { state.clones = normalizeClones(state.storage.load()); }
  catch { state.storageWarning = 'Saved library could not be read. Export any new entries before leaving.'; }
  disable(['plant-type','plant-label','clone-genes','add-clone'],false);
  renderClones(); libraryMessage(''); updateCaptureControls(); invalidatePlan();
  scannerStatus('Preview only');
  message('capture-help','Share only the Rust window or load a screenshot. Frames stay in this browser. The recognition engine is loaded separately.');
  if (!supportsCapture()) message('detection-confidence','Screen sharing requires a supported desktop browser and HTTPS or localhost. Screenshot import is available.');
  const [storage,scanner,genetics] = await Promise.all([
    optionalModule('./js/storage.js'),optionalModule('./js/scanner.js'),optionalModule('./js/genetics.js')
  ]);
  if (typeof storage?.createStorage === 'function') {
    try {
      const adapter = storage.createStorage({key:KEY});
      if (typeof adapter.load !== 'function' || typeof adapter.save !== 'function') throw new Error('Invalid storage adapter');
      // Both adapters must use the same key/schema. Keep the live library so a
      // slow module load cannot replace changes made while the site was usable.
      state.storage = adapter; // Same storage key; no write until the user changes the library.
    } catch (error) { console.warn('Field Manual: storage adapter unavailable.',error); }
  }
  if (typeof scanner?.detectGenes === 'function') {
    state.scanner = scanner.detectGenes;
    scannerStatus(state.stream?'Screen shared':state.image?'Screenshot ready':'Ready',state.stream||state.image?'active':'idle');
    message('capture-help','Share only the Rust window or load a screenshot. Recognition runs locally. Auto-add saves a genotype after two consecutive high-score live frames; select the correct species and verify your library.');
    if (state.image) void scanFrame({manual:true}); else scheduleScan();
  }
  if (typeof genetics?.findBreedingPlan === 'function') {
    state.genetics = genetics.findBreedingPlan;
    const heading = el('breeder-form').closest('.tool-panel')?.querySelector('.panel-heading > span');
    if (heading) heading.textContent = 'ENGINE / READY';
    invalidatePlan();
  }
  if (state.scanner && state.genetics) {
    const intro = document.querySelector('#genetics > .section-heading > p');
    if (intro) intro.textContent = 'Collect plant genetics automatically and compare the best reachable breeding options, with a separate layout for each cross.';
  }
  updateCaptureControls();
}
boot().catch(error => console.error('Field Manual initialization failed.',error));
