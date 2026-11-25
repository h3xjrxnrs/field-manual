import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { visualGuides } from '../js/visual-data.js';
import { renderArt } from '../js/visual-art.js';
const root=fileURLToPath(new URL('../assets/visual-guides/',import.meta.url));
let count=0;
for(const g of visualGuides){
  const dir=path.join(root,g.id);fs.mkdirSync(dir,{recursive:true});
  g.steps.forEach((s,i)=>{fs.writeFileSync(path.join(dir,`${i+1}.svg`),renderArt(g,s,i));count++;});
}
console.log(`Rendered ${count} steps across ${visualGuides.length} guides.`);
