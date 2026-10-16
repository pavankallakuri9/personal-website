'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const folders = { research:'Research', 'sales-mastery':'Sales Mastery', leadership:'Leadership', 'leadership-atlas':'Leadership' };
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes:true }).flatMap(item => {
    if (item.name.startsWith('.')) return [];
    const p = path.join(dir,item.name);
    return item.isDirectory() ? walk(p) : item.isFile() && /\.html?$/i.test(item.name) ? [p] : [];
  });
}
function contentOf(html, tag) {
  const match = html.match(new RegExp('<'+tag+'\\b[^>]*>([\\s\\S]*?)<\\/'+tag+'>','i'));
  return match ? clean(match[1]) : '';
}
function clean(value) {
  return String(value||'').replace(/<[^>]*>/g, ' ').replace(/&amp;/gi,'&').replace(/&nbsp;/gi,' ').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/\s+/g,' ').trim();
}
function metaOf(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const a = Object.fromEntries([...tag.matchAll(/([a-z-]+)\s*=\s*["']([^"']*)["']/gi)].map(m=>[m[1].toLowerCase(),m[2]]));
    if ((a.name||'').toLowerCase() === name.toLowerCase()) return clean(a.content);
  }
  return '';
}
function urlPath(file) { return '/' + path.relative(root,file).split(path.sep).map(encodeURIComponent).join('/'); }
const items=[];
for (const [folder,category] of Object.entries(folders)) {
  for (const file of walk(path.join(root,folder))) {
    const html = fs.readFileSync(file,'utf8');
    if (metaOf(html,'library-hide') === 'true') continue;
    let title = metaOf(html,'library-title') || contentOf(html,'title') || contentOf(html,'h1') || path.basename(file,'.html');
    let description = metaOf(html,'library-description') || metaOf(html,'description') || '';
    if (!description) description = 'Explore this interactive '+category.toLowerCase()+' resource.';
    items.push({title, description:description.slice(0,240), category, url:urlPath(file)});
  }
}
items.sort((a,b)=>a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
// Copy deployable public assets to dist. Leave development scripts and configuration outside the site.
fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
for (const name of fs.readdirSync(root)) {
  if (['dist','scripts','node_modules','.git','package.json','vercel.json','README-AUTOMATION.md'].includes(name) || name.startsWith('.')) continue;
  const from = path.join(root,name), to=path.join(out,name); const stat=fs.statSync(from);
  if (stat.isDirectory()) fs.cpSync(from,to,{recursive:true});
  else if (stat.isFile() && /\.(html|css|js|json|png|jpe?g|webp|svg|ico|txt|pdf|xml)$/i.test(name)) fs.copyFileSync(from,to);
}
fs.writeFileSync(path.join(out,'resource-catalog.json'),JSON.stringify({generatedAt:new Date().toISOString(),resources:items},null,2));
console.log(`Built ${items.length} resource cards into dist/resource-catalog.json`);
