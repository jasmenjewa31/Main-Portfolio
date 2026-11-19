import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import sharp from 'sharp';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const report = here;
const hash = data => crypto.createHash('sha256').update(data).digest('hex').slice(0,12);
const manifest = {};
async function output(name, data) {
  const extension = path.extname(name);
  const versioned = name.slice(0,-extension.length) + '.' + hash(data) + extension;
  await fs.writeFile(path.join(root,versioned),data);
  manifest[name] = { path: versioned, bytes: data.length };
  return versioned;
}
const htmlFile=path.join(root,'index.html');
let html=await fs.readFile(htmlFile,'utf8');
const original='Media/Images/4147bbe8-c0d5-4b1c-9535-98da9a227876.png';
const mobile=[];
for (const width of [330,660,1023]) {
  const data=await sharp(path.join(root,original)).resize({width}).webp({lossless:true,effort:6}).toBuffer();
  const dest=await output('Media/Images/collage-mobile-'+width+'.webp',data);
  mobile.push(dest+' '+width+'w');
}
// Leave the desktop image choices and the mobile framing rules untouched.
html=html.replace(/(<figure class="showcase-figure[\s\S]*?<picture>)(?:\s*<source data-mobile-collage[^>]*>)?/,
  '$1\n              <source data-mobile-collage type="image/webp" media="(max-width: 720px)" srcset="'+mobile.join(', ')+'" sizes="calc(100vw - 82px)" />');
const logo=[];
for(const width of [56,112,168]){
  const data=await sharp(path.join(root,'assets/jasmen-asia-logo.png')).resize({width}).webp({lossless:true,effort:6}).toBuffer();
  const dest=await output('assets/jasmen-logo-'+width+'.webp',data);
  logo.push(dest+' '+width+'w');
}
html=html.replace(/<img[^>]*src="(?:assets\/jasmen-asia-logo.png|assets\/jasmen-logo-[^"]+)"[^>]*>/,
  '<img src="'+manifest['assets/jasmen-logo-168.webp'].path+'" srcset="'+logo.join(', ')+'" sizes="(max-width: 720px) 48px, 56px" width="56" height="56" alt="" />');
const sourceFile=path.join(here,'homepage.source.css');
try { await fs.access(sourceFile); } catch {
  await fs.writeFile(sourceFile,html.match(/<style>([\s\S]*?)<\/style>/)[1]);
}
const source=await fs.readFile(sourceFile,'utf8');
const minifier=new CleanCSS({level:{1:{all:true,specialComments:0},2:{all:false,removeDuplicateRules:true,removeDuplicateMediaBlocks:true}}});
function minify(css) {
  const result=minifier.minify(css);
  if(result.errors.length)throw Error(result.errors.join('\n'));
  return result.styles;
}
const minified=minify(source);
html=html.replace(/<style>[\s\S]*?<\/style>/,'<style>'+minified+'</style>');
manifest.inlineCSS={beforeBytes:Buffer.byteLength(source),afterBytes:Buffer.byteLength(minified)};
const wa=await fs.readFile(path.join(root,'assets/whatsapp-enquiry.css'),'utf8');
const waPath=await output('assets/whatsapp-enquiry.min.css',Buffer.from(minify(wa)));
html=html.replace(/assets\/whatsapp-enquiry(?:\.min\.[a-f0-9]+)?\.css(?:\?v=3)?/g,waPath);
const motionName='Projects/Creative Portfolio/process-background.js';
const motion=await fs.readFile(path.join(root,motionName));
const motionPath=await output('assets/process-background.js',motion);
html=html.replace(/(?:Projects\/Creative Portfolio\/|assets\/)process-background(?:\.[a-f0-9]+)?\.js(?:\?v=[^"]+)?/g,motionPath);
await fs.writeFile(htmlFile,html);
await fs.mkdir(report,{recursive:true});
await fs.writeFile(path.join(report,'asset-manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,2));
