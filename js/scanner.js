/** FIELD MANUAL — by Lalo | Genetics scanner v0.1
 * Native Canvas 2D. No network, dependencies or game-process access.
 * Score is a heuristic, not a calibrated probability. Requires real UI calibration.
 * detectGenes(canvas,{signal}) -> Promise<null|{genes,confidence}>
 */
const N=28, MAX_SIDE=2048, MAX_COMPONENTS=1800;
const LETTERS='GYHWX';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
const pause=()=>new Promise(r=>setTimeout(r,0));
const abort=s=>{if(s?.aborted)throw new DOMException('Scan cancelled','AbortError');};
const luminance=(r,g,b)=>.299*r+.587*g+.114*b;
let templates;
function context(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('Canvas 2D unavailable');return ctx;}
function colour(r,g,b){
  if(g>=42&&g-r>=Math.max(9,g*.085)&&g-b>=Math.max(5,g*.035))return 1;
  if(r>=48&&r-g>=Math.max(13,r*.13)&&r-b>=Math.max(10,r*.09))return 2;
  return 0;
}
// Crop ink bounds, preserve aspect ratio, supersample into a fixed glyph grid.
function normalize(mask,w,h){
  let l=w,t=h,r=-1,b=-1,count=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);count++;}
  const bw=r-l+1,bh=b-t+1;
  if(count<7||bw<3||bh<5||bw/bh<.25||bw/bh>1.7||count/(bw*bh)>.91)return null;
  const data=new Float32Array(N*N),scale=(N-4)/Math.max(bw,bh),ox=(N-bw*scale)/2,oy=(N-bh*scale)/2;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    let v=0;for(const dy of [.2,.5,.8])for(const dx of [.2,.5,.8]){
      const sx=Math.floor((x+dx-ox)/scale),sy=Math.floor((y+dy-oy)/scale);
      if(sx>=0&&sx<bw&&sy>=0&&sy<bh)v+=mask[(sy+t)*w+sx+l]?1:0;
    }data[y*N+x]=v/9;
  }
  return {data,aspect:bw/bh};
}
function getTemplates(){
  if(templates)return templates;
  const ctx=context(64,64),out=[];
  for(const family of ['Arial','Arial Narrow','Verdana','Tahoma','sans-serif','monospace'])for(const weight of [400,700])for(const letter of LETTERS){
    ctx.clearRect(0,0,64,64);ctx.fillStyle='#fff';ctx.font=`${weight} 42px ${family.includes(' ')?'"'+family+'"':family}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(letter,32,32);
    const pixels=ctx.getImageData(0,0,64,64).data,mask=new Uint8Array(4096);
    for(let i=0;i<mask.length;i++)mask[i]=pixels[i*4+3]>=100?1:0;
    const n=normalize(mask,64,64);if(n)out.push({letter,...n});
  }templates=out;return out;
}
function similarity(a,b){
  let best=0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    let overlap=0,union=0;
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      const xx=x+dx,yy=y+dy,v=a.data[y*N+x],u=xx>=0&&xx<N&&yy>=0&&yy<N?b.data[yy*N+xx]:0;
      overlap+=Math.min(v,u);union+=Math.max(v,u);
    }best=Math.max(best,union?overlap/union:0);
  }return best*Math.exp(-.20*Math.abs(Math.log(a.aspect/b.aspect)));
}
function classify(masks,kind){
  const allowed=kind===1?'GYH':'WX',scores=Object.fromEntries([...allowed].map(l=>[l,0]));
  for(const n of masks)if(n)for(const t of getTemplates())if(allowed.includes(t.letter))scores[t.letter]=Math.max(scores[t.letter],similarity(n,t));
  const sorted=[...allowed].map(letter=>({letter,score:scores[letter]})).sort((a,b)=>b.score-a.score),best=sorted[0],margin=best.score-sorted[1].score;
  if(best.score<.49||margin<.055)return null;
  return {...best,confidence:clamp(.60+.46*(best.score-.49)/.51+.14*Math.min(1,margin/.24),0,.99)};
}
// Connected colour regions. Four neighbours, no diagonal connections.
async function components(data,w,h,signal){
  const mask=new Uint8Array(w*h),seen=new Uint8Array(w*h),queue=new Int32Array(w*h),items=[];
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){const i=y*w+x,p=i*4;mask[i]=colour(data[p],data[p+1],data[p+2]);}
    if(y%160===159){abort(signal);await pause();}
  }
  const maxDim=Math.min(110,Math.max(28,Math.round(h*.095)));
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const start=y*w+x,kind=mask[start];if(!kind||seen[start])continue;
      let head=0,tail=1,x0=x,x1=x,y0=y,y1=y;queue[0]=start;seen[start]=1;
      while(head<tail){
        const i=queue[head++],px=i%w,py=(i/w)|0;
        x0=Math.min(x0,px);x1=Math.max(x1,px);y0=Math.min(y0,py);y1=Math.max(y1,py);
        for(let k=0;k<4;k++){
          if((k===0&&px===0)||(k===1&&px===w-1)||(k===2&&py===0)||(k===3&&py===h-1))continue;
          const j=i+(k===0?-1:k===1?1:k===2?-w:w);if(mask[j]===kind&&!seen[j]){seen[j]=1;queue[tail++]=j;}
        }
      }
      const bw=x1-x0+1,bh=y1-y0+1,fill=tail/(bw*bh),ratio=bw/bh;
      if(bw>=4&&bh>=7&&bw<=maxDim&&bh<=maxDim&&ratio>=.28&&ratio<=1.55&&fill>=.12&&tail>=12)items.push({x:x0,y:y0,w:bw,h:bh,cx:(x0+x1)/2,cy:(y0+y1)/2,kind,fill});
    }
    if(y%100===99){abort(signal);await pause();}
  }
  return {mask,items:items.length<=MAX_COMPONENTS?items:[]};
}
// Support coloured text on a dark background and filled badges with contrast ink.
function glyphs(b,data,mask,w){
  const {x,y,w:bw,h:bh,kind}=b, candidates=[],direct=new Uint8Array(bw*bh),bright=new Uint8Array(bw*bh),dark=new Uint8Array(bw*bh),inverse=new Uint8Array(bw*bh),sample=[];
  for(let yy=0;yy<bh;yy++)for(let xx=0;xx<bw;xx++){
    const i=(y+yy)*w+x+xx,p=i*4;direct[yy*bw+xx]=mask[i]===kind?1:0;if(mask[i]===kind)sample.push(luminance(data[p],data[p+1],data[p+2]));
  }
  if(b.fill<.66)candidates.push(normalize(direct,bw,bh));
  sample.sort((a,b)=>a-b);const base=sample[Math.floor(sample.length/2)];
  for(let yy=0;yy<bh;yy++)for(let xx=0;xx<bw;xx++){
    const nx=(xx+.5-bw/2)/(bw/2),ny=(yy+.5-bh/2)/(bh/2);if(nx*nx+ny*ny>.88*.88)continue;
    const i=(y+yy)*w+x+xx,p=i*4,L=luminance(data[p],data[p+1],data[p+2]),j=yy*bw+xx;
    bright[j]=L>base+Math.max(16,(255-base)*.13)?1:0;dark[j]=L<base-Math.max(12,base*.18)?1:0;inverse[j]=mask[i]!==kind&&Math.abs(L-base)>10?1:0;
  }
  if(b.fill>=.35)for(const m of [bright,dark,inverse])candidates.push(normalize(m,bw,bh));
  return candidates.filter(Boolean);
}
function compatible(a,b){return Math.abs(a.cy-b.cy)<=Math.max(2,Math.min(a.h,b.h)*.24)&&Math.max(a.h,b.h)/Math.min(a.h,b.h)<=1.32&&Math.max(a.w,b.w)/Math.min(a.w,b.w)<=1.8;}
function rows(items){
  const sorted=[...items].sort((a,b)=>a.cx-b.cx),out=[],seen=new Set();
  for(let i=0;i<sorted.length;i++){
    const a=sorted[i];
    for(let j=i+1;j<sorted.length;j++){
      const b=sorted[j],gap=b.cx-a.cx;
      if(gap>Math.max(a.h,a.w)*3.4)break;
      if(gap<Math.max(5,(a.w+b.w)*.46)||!compatible(a,b))continue;
      const row=[a,b];let error=0,last=j;
      for(let k=2;k<6;k++){
        const expected=a.cx+k*gap,tolerance=Math.max(2,gap*.19);let best=null,bi=-1,cost=Infinity;
        for(let l=last+1;l<sorted.length;l++){
          const v=sorted[l],dx=v.cx-expected;if(dx>tolerance)break;
          if(Math.abs(dx)>tolerance||!compatible(a,v)||!compatible(b,v))continue;
          const score=Math.abs(dx)/tolerance+Math.abs(v.cy-a.cy)/a.h;if(score<cost){best=v;bi=l;cost=score;}
        }
        if(!best)break;row.push(best);last=bi;error+=cost;
      }
      if(row.length!==6)continue;
      if(sorted.some(v=>compatible(a,v)&&[a.cx-gap,a.cx+6*gap].some(p=>Math.abs(v.cx-p)<=Math.max(2,gap*.15))))continue;
      const key=row.map(v=>`${v.x}:${v.y}`).join('|');if(seen.has(key))continue;seen.add(key);
      out.push({row,geometry:clamp(1-error/8,0,1)});
      if(out.length>180)return out.sort((a,b)=>b.geometry-a.geometry).slice(0,35);
    }
  }return out.sort((a,b)=>b.geometry-a.geometry).slice(0,35);
}
/** Returns null when no credible row or multiple similarly credible rows exist. */
export async function detectGenes(source,{signal}={}){
  abort(signal);
  if(!source||!Number.isFinite(source.width)||!Number.isFinite(source.height)||source.width<12||source.height<12)return null;
  const scale=Math.min(1,MAX_SIDE/Math.max(source.width,source.height)),w=Math.round(source.width*scale),h=Math.round(source.height*scale);
  if(w<12||h<12)return null;
  const ctx=context(w,h);ctx.drawImage(source,0,0,w,h);const {data}=ctx.getImageData(0,0,w,h);
  const {items,mask}=await components(data,w,h,signal);abort(signal);
  const results=[],cache=new Map();
  for(const candidate of rows(items)){
    abort(signal);const matches=[];
    for(const b of candidate.row){if(!cache.has(b))cache.set(b,classify(glyphs(b,data,mask,w),b.kind));const m=cache.get(b);if(!m)break;matches.push(m);}
    if(matches.length===6){const scores=matches.map(m=>m.confidence),confidence=clamp((mean(scores)*.65+Math.min(...scores)*.35)*(.88+.12*candidate.geometry),0,.99);if(confidence>=.64)results.push({genes:matches.map(m=>m.letter).join(''),confidence});}
    await pause();
  }
  abort(signal);results.sort((a,b)=>b.confidence-a.confidence);const best=results[0];if(!best)return null;
  if(results.some(r=>r.genes!==best.genes&&best.confidence-r.confidence<.08))return null;
  return {genes:best.genes,confidence:Number(best.confidence.toFixed(3))};
}
