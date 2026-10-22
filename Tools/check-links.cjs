const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = [];
function walk(dir) { for (const d of fs.readdirSync(dir, {withFileTypes:true})) { if (['.git','node_modules'].includes(d.name)) continue; const p=path.join(dir,d.name); if(d.isDirectory()) walk(p); else files.push(p); } }
walk(root);
const issues=[]; let checked=0;
const rel=p=>path.relative(root,p).replaceAll('\\','/');
const live = /^(index\.html$|Projects\/(Creative Portfolio|Industrial\/industrial-site\/dist|Skin Care\/AURA|Fashion\/ELARA|Lotus Life Style\/Working Project\/dist|Dental\/Aurelle|Content Creators\/Maitreyi)\/|Deliverables\/exports\/Jayshree-Jewa-Portfolio\/)/;
for(const file of files.filter(p=>/\.(html|css|js)$/i.test(p) && (!process.argv.includes('--live') || live.test(rel(p))))) {
 const text=fs.readFileSync(file,'utf8');
 const refs=[...text.matchAll(/(?:\b(?:src|href|poster)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^\s)'";]+)["']?\s*\)|\burl\s*:\s*["']([^"']+)["'])/g)];
 for(const m of refs) {
  const raw=m[1]||m[2]||m[3];
  if(/^(?:[a-z][a-z\d+.-]*:|\/\/|#|\$|\{)/i.test(raw)) continue;
  const url=raw.split(/[?#]/)[0]; if(!url) continue;
  let decoded; try {decoded=decodeURIComponent(url);} catch {continue;}
  if(decoded.startsWith('#')) continue;
  const target=path.resolve(path.dirname(file),decoded); checked++;
  const line=text.slice(0,m.index).split('\n').length;
  if(!fs.existsSync(target)) {issues.push({file:rel(file),line,url:raw,problem:'Missing target'});continue;}
  let current=root; const parts=path.relative(root,target).split(path.sep);
  if(parts[0]==='..') {issues.push({file:rel(file),line,url:raw,problem:'Outside site root'});continue;}
  for(const part of parts) { const names=fs.readdirSync(current); const actual=names.find(n=>n.toLowerCase()===part.toLowerCase()); if(actual!==part) {issues.push({file:rel(file),line,url:raw,problem:'Filename case mismatch'});break;} current=path.join(current,part); }
 }
}
const result={files:files.length,referencesChecked:checked,issues};
console.log(JSON.stringify(result,null,2));
if(issues.length) process.exitCode=1;
