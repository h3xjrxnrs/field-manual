/**
 * FIELD MANUAL — by Lalo | Genetics engine v2.0
 * Browser-native ES module; no dependencies, network, or game access.
 * Public API: simulateCrossbreed(center, donors), findBreedingPlan(options).
 * Model: https://rust.facepunch.com/news/farming-update
 * Community numerical model: https://rustgenetics.com/en/about/
 * Donors vote independently in each of six ordered slots. The center's
 * own gene is a replacement threshold, not an additional donor vote.
 * Green weights = 3, red = 5 (integer equivalents of 0.6 and 1.0).
 * Tied winning donor genes are ambiguous; the planner avoids them rather
 * than assuming random, independent or equally probable outcomes.
 * Bounded heuristic search, not an exhaustive proof of optimality.
 */
export const GENE_WEIGHTS = Object.freeze({G:3,Y:3,H:3,W:5,X:5});
const LETTERS = 'GYHWX';
const WEIGHTS = [3,3,3,5,5];
const CELLS = [0,2,6,8,1,3,5,7];
const MAX_LIBRARY = 2000;
const DONOR_POOL = 16;
const CENTER_POOL = 32;
const NEW_POOL = 36;
const SETS_PER_SIZE = 1500;
const GENE_PATTERN = /^[GYHWX]{6}$/;
const valid = g => typeof g === 'string' && GENE_PATTERN.test(g);
const digits = g => Array.from(g, x => LETTERS.indexOf(x));
const matches = (a,b) => Array.from(a).reduce((n,g,i)=>n+Number(g===b[i]),0);
const greens = g => Array.from(g).filter(x=>'GYH'.includes(x)).length;
const compareText = (a,b) => a < b ? -1 : a > b ? 1 : 0;

function requireGenes(genes) {
  if (!valid(genes)) throw new TypeError('Expected exactly six uppercase genes: G, Y, H, W, X.');
  return genes;
}
function abortIfNeeded(signal) {
  if (signal?.aborted) throw new DOMException('Breeding search cancelled.','AbortError');
}
const yieldToBrowser = () => new Promise(resolve=>setTimeout(resolve,0));

/** Compute winning donor votes once, then compare them against each center. */
function votes(donorDigits) {
  const totals = new Uint8Array(30);
  for (const donor of donorDigits) for(let i=0;i<6;i++) {
    const j=donor[i]; totals[i*5+j]+=WEIGHTS[j];
  }
  const high = new Uint8Array(6), masks = new Uint8Array(6);
  for(let i=0;i<6;i++) for(let j=0;j<5;j++) {
    const value=totals[i*5+j];
    if(value>high[i]) { high[i]=value; masks[i]=1<<j; }
    else if(value && value===high[i]) masks[i]|=1<<j;
  }
  return {totals,high,masks};
}
function slotMask(center, v, i) {
  return v.high[i] > WEIGHTS[center[i]] ? v.masks[i] : 1<<center[i];
}
function deterministic(center,v) {
  let result='';
  for(let i=0;i<6;i++) {
    const mask=slotMask(center,v,i);
    if(mask & (mask-1)) return null;
    result+=LETTERS[31-Math.clz32(mask)];
  }
  return result;
}

/** Inspect each slot, including ties; never invent an exact probability. */
export function simulateCrossbreed(center, donors) {
  requireGenes(center);
  if(!Array.isArray(donors)||donors.length>8) throw new TypeError('Use zero to eight donor genotypes.');
  donors.forEach(requireGenes);
  const c=digits(center), v=votes(donors.map(digits));
  const slots=Array.from({length:6},(_,i)=>{
    const mask=slotMask(c,v,i);
    const candidates=Array.from(LETTERS).filter((_,j)=>mask&(1<<j));
    return {position:i+1,center:center[i],candidates,
      donorWeights:Object.fromEntries(Array.from(LETTERS,(g,j)=>[g,v.totals[i*5+j]/5])),
      ambiguous:candidates.length>1};
  });
  const result=deterministic(c,v);
  return {center,donors:[...donors],result,deterministic:result!==null,slots};
}

function speciesKey(clone) {
  const plant=clone.plant;
  if(!['hemp','corn','potato','pumpkin','berry','other'].includes(plant)) throw new TypeError('Unknown plant species.');
  const label=String(clone.label??'').trim().replace(/\s+/g,' ').toLowerCase();
  if(['berry','other'].includes(plant)&&!label) throw new TypeError('Specify the exact plant species.');
  return JSON.stringify([plant,['berry','other'].includes(plant)?label:'']);
}
function baseNode(genes) { return {genes,digits:digits(genes),recipe:null,deps:[],cost:0,plants:0}; }
const traits = genes => Object.fromEntries(Array.from(LETTERS,g=>[g,[...genes].filter(x=>x===g).length]));
const profiles = ['balanced','growth','yield','target'];
function score(node,target,profile) {
  const {G,Y,H,W,X}=traits(node.genes), useful=G+Y, match=matches(node.genes,target);
  const prefix = profile==='target' ? [match,useful,H] : profile==='growth' ? [useful,G,H,match] : profile==='yield' ? [useful,Y,H,match] : [useful,Math.min(G,Y),H,match];
  return [...prefix,-node.cost,-node.plants];
}
function rank(a,b,target,profile='target') {
  const x=score(a,target,profile),y=score(b,target,profile);
  for(let i=0;i<x.length;i++)if(x[i]!==y[i])return y[i]-x[i];
  return compareText(a.genes,b.genes);
}
// Preserve a mix of high-quality candidates for every objective and rare desired slots.
function choosePool(nodes,target,limit) {
  const all=[...nodes]; if(all.length<=limit)return all;
  const ranked=profiles.map(profile=>[...all].sort((a,b)=>rank(a,b,target,profile)));
  const out=[],seen=new Set();
  const add=n=>{if(n&&out.length<limit&&!seen.has(n.genes)){seen.add(n.genes);out.push(n);}};
  for(const arr of ranked)add(arr[0]);
  for(let slot=0;slot<6;slot++) add(ranked[3].find(n=>n.genes[slot]===target[slot]&&!seen.has(n.genes)));
  for(let i=1;out.length<limit&&i<all.length;i++)for(const arr of ranked)add(arr[i]);
  return out;
}
// Multisets permit identical donor copies. Small sets are exhaustive in
// the selected pool. Large sets combine a deterministic prefix and
// seeded sampling, with a separate budget for each planter occupancy.
function* combinations(n,k,start=0,prefix=[]) {
  if(k===0){yield prefix;return;}
  for(let i=start;i<n;i++) yield* combinations(n,k-1,i,[...prefix,i]);
}
function chooseCount(n,k) {
  let count=1;
  for(let i=1;i<=k;i++) count=count*(n+i-1)/i;
  return Math.round(count);
}
function* donorSets(n,k,seed) {
  const total=chooseCount(n,k);
  if(total<=SETS_PER_SIZE){yield* combinations(n,k);return;}
  const seen=new Set();
  const prefixLimit=Math.floor(SETS_PER_SIZE/3);
  for(const set of combinations(n,k)){
    seen.add(set.join(','));yield set;
    if(seen.size>=prefixLimit)break;
  }
  // Include concentrated votes and a spread of different donor genotypes.
  for(let i=0;i<n;i++) {
    const set=Array(k).fill(i), key=set.join(',');
    if(!seen.has(key)){seen.add(key);yield set;}
  }
  let x=seed>>>0||1;
  const random=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
  for(let tries=0;seen.size<SETS_PER_SIZE&&tries<SETS_PER_SIZE*12;tries++){
    const set=Array.from({length:k},()=>Math.floor(random()*n)).sort((a,b)=>a-b);
    const key=set.join(','); if(seen.has(key))continue; seen.add(key);yield set;
  }
}
function mergeDependencies(nodes) {
  const map=new Map();
  for(const node of nodes) for(const recipe of node.deps) {
    // Every result has one selected recipe in the search library.
    if(!map.has(recipe.result)) map.set(recipe.result,recipe);
  }
  return [...map.values()];
}
function makeNode(result,center,donors,deps) {
  const recipe={result,center:center.genes,donors:donors.map(n=>n.genes)};
  const all=[...deps,recipe];
  return {genes:result,digits:digits(result),recipe,deps:all,cost:all.length,
    plants:all.reduce((sum,r)=>sum+r.donors.length+1,0)};
}
function layoutFor(recipe) {
  if(!recipe)return [];
  const layout=Array.from({length:9},(_,cell)=>({cell,role:'empty',label:'—'}));
  layout[4]={cell:4,role:'target',label:recipe.center};
  recipe.donors.forEach((g,i)=>{const cell=CELLS[i];layout[cell]={cell,role:'donor',label:g};});
  return layout;
}
function stepsFor(node) {
  if(!node.recipe)return [`You already own ${node.genes}. Clone it without crossbreeding; keep a reserve of the original genotype.`];
  const out=['Use a separate large 3×3 planter for each cross. Multiply your saved clones first: repeated donor genotypes require separate physical copies. Keep backup clones of all input genotypes. Each cross has its own layout below.'];
  node.deps.forEach((r,i)=>{
    const donorText=r.donors.map((g,j)=>`slot ${CELLS[j]+1}: ${g}`).join('; ');
    out.push(`Cross ${i+1}/${node.cost}: plant ${r.center} in slot 5 (center) first. Keep every other slot empty initially.`);
    out.push(`Before the center enters Crossbreed, plant donors in this layout: ${donorText}. Leave unlisted slots empty. Time the planting so the center reaches Crossbreed before donors can change their genes; verify their actual genotypes.`);
    out.push(`After the center inherits its genes, verify ${r.result}. Take and save clones while the game permits cloning. Do not continue with the next cross until the expected genotype is confirmed.`);
  });
  return out;
}
function resultFor(node,target,stats,already=false) {
  const exact=node.genes===target;
  const prefix=already?`You already own ${node.genes}.`:exact?`Found ${target} in ${node.cost} cross${node.cost===1?'':'es'} under the no-tie model.`:`Found ${node.genes} (${matches(node.genes,target)}/6 matching target slots, ${node.cost} crosses) within the search budget.`;
  return {message:prefix,steps:stepsFor(node),layout:layoutFor(node.deps[0]),
    exact,genes:node.genes,target,generations:node.cost,recipes:node.deps.map(r=>({...r,donors:[...r.donors],layout:layoutFor(r)})),traits:traits(node.genes),matches:matches(node.genes,target),stats};
}

/**
 * Search up to maxGenerations sequential crosses (including all dependency
 * crosses). Search is bounded and cooperatively yields to the browser.
 * Clone records match storage.js/app.js; all must be the same species.
 * An original genotype can be cloned into any required number of copies.
 */
export async function findBreedingPlan({clones,target,maxGenerations=1,signal}={}) {
  abortIfNeeded(signal);
  requireGenes(target);
  if(![1,2,3].includes(maxGenerations)) throw new RangeError('Choose one to three crosses.');
  if(!Array.isArray(clones)||!clones.length||clones.length>MAX_LIBRARY) throw new TypeError('Provide 1–2000 saved clones.');
  const species=speciesKey(clones[0]), library=new Map();
  for(const clone of clones){
    if(speciesKey(clone)!==species) throw new TypeError('Cannot crossbreed different plant species.');
    const g=requireGenes(clone.genes); if(!library.has(g)) library.set(g,baseNode(g));
  }
  const stats={donorSets:0,layouts:0,rounds:0,heuristic:true};
  const discovered=new Map(library);
  const missing=Array.from(target,(g,i)=>[g,i]).filter(([g,i])=>![...library.keys()].some(s=>s[i]===g));
  function finalize(){
    const all=[...discovered.values()];
    const selected=[], used=new Set(), compositions=new Set();
    const composition=n=>Object.values(traits(n.genes)).join(',');
    const take=(n,profile)=>{if(!n||used.has(n.genes)||selected.length>=4)return;used.add(n.genes);compositions.add(composition(n));selected.push({...resultFor(n,target,{...stats},!n.recipe),profile});};
    // Always retain the exact target if found, then show the best distinct trait mixes.
    if(discovered.has(target))take(discovered.get(target),'target');
    const ranked=Object.fromEntries(profiles.map(k=>[k,[...all].sort((a,b)=>rank(a,b,target,k))]));
    for(const profile of profiles){
      const best=ranked[profile][0];
      if(!best||used.has(best.genes)||compositions.has(composition(best)))continue;
      take(best,profile);
    }
    for(const profile of profiles){
      if(selected.length>=4)break;
      const best=ranked[profile][0];
      // Prefer varied mixes with the same number of useful genes as the best mix.
      take(ranked[profile].find(n=>!used.has(n.genes)&&!compositions.has(composition(n))&&(traits(n.genes).G+traits(n.genes).Y===traits(best.genes).G+traits(best.genes).Y)),profile);
    }
    for(const n of ranked.balanced){if(selected.length>=4)break;if(!compositions.has(composition(n)))take(n,'alternative');}
    // If all outcomes have the same trait mix, different layouts can still be useful.
    for(const n of ranked.balanced){if(selected.length>=4)break;take(n,'alternative');}
    const top=selected[0];
    return {...top,alternatives:selected,message:`${selected.length} distinct option${selected.length===1?'':'s'} found from ${all.length} reachable genotype${all.length===1?'':'s'} within the search budget. ${missing.length?'Exact target requires missing starting genes: '+missing.map(([g,i])=>g+' at slot '+(i+1)).join(', ')+'. ':''}Only unambiguous crosses are shown; the search is not exhaustive.`};
  }
  let lastYield=Date.now();
  for(let round=1;round<=maxGenerations;round++) {
    stats.rounds=round;
    const existing=[...library.values()];
    const centers=choosePool(existing,target,CENTER_POOL);
    const donorPool=choosePool(existing,target,DONOR_POOL);
    const candidates=new Map();

    for(let count=1;count<=8;count++) {
      for(const indices of donorSets(donorPool.length,count,0x6d2b79f5+round*101+count*17)) {
        abortIfNeeded(signal);
        stats.donorSets++;
        const donors=indices.map(i=>donorPool[i]);
        const v=votes(donors.map(n=>n.digits));
        const donorDeps=mergeDependencies(donors);
        if(donorDeps.length+1<=round) for(const center of centers) {
          stats.layouts++;
          const result=deterministic(center.digits,v);
          if(!result||library.has(result))continue;
          const deps=mergeDependencies([{deps:donorDeps},center]);
          if(deps.length+1>round)continue;
          const previous=candidates.get(result);
          const cost=deps.length+1;
          if(previous&&previous.cost<cost)continue;
          const node=makeNode(result,center,donors,deps);
          if(previous&&rank(node,previous,target)>=0)continue;
          candidates.set(result,node);

        }
        if(Date.now()-lastYield>=24) {await yieldToBrowser();abortIfNeeded(signal);lastYield=Date.now();}
      }

    }
    if(!candidates.size)break;
    for(const [g,node] of candidates){const old=discovered.get(g);if(!old||rank(node,old,target)<0)discovered.set(g,node);}
    for(const node of choosePool(candidates.values(),target,NEW_POOL))library.set(node.genes,node);
    await yieldToBrowser();abortIfNeeded(signal);
  }
  return finalize();
}
