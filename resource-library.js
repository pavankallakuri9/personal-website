(() => {
  const cards = (container, resources, limit = Infinity) => {
    container.replaceChildren();
    if (!resources.length) {
      const msg = document.createElement('p');
      msg.className = 'library-empty';
      msg.textContent = 'More resources will appear here as they are published.';
      container.append(msg); return;
    }
    for (const resource of resources.slice(0,limit)) {
      const card = document.createElement('a');
      card.className='resource-card';
      card.href=resource.url;
      const category = document.createElement('span');category.className='resource-category';category.textContent=resource.category;
      const title=document.createElement('strong');title.textContent=resource.title;
      const desc=document.createElement('span');desc.className='resource-description';desc.textContent=resource.description;
      const action=document.createElement('span');action.className='resource-action';action.textContent='Explore resource ↗';
      card.append(category,title,desc,action);container.append(card);
    }
  };
  const load = async () => {
    const response = await fetch('/resource-catalog.json', {cache:'no-cache'});
    if (!response.ok) throw new Error('Unable to retrieve library');
    const data=await response.json();
    return Array.isArray(data.resources) ? data.resources : [];
  };
  document.addEventListener('DOMContentLoaded', async () => {
    const containers=[...document.querySelectorAll('[data-resource-section]')];
    const library=document.getElementById('library-results');
    if (!containers.length && !library) return;
    try {
      const all=await load();
      for (const el of containers) {
        const matching=all.filter(r=>r.category===el.dataset.resourceSection);
        cards(el,matching,Number(el.dataset.limit)||3);
      }
      if (library) {
        const search=document.getElementById('library-search');
        const filter=document.getElementById('library-category');
        const count=document.getElementById('library-count');
        const refresh=()=>{
          const q=(search?.value||'').trim().toLocaleLowerCase();const cat=filter?.value||'All';
          const filtered=all.filter(r=>(cat==='All'||r.category===cat)&&(!q||[r.title,r.description,r.category].join(' ').toLocaleLowerCase().includes(q)));
          cards(library,filtered);
          if(count) count.textContent=`${filtered.length} resource${filtered.length===1?'':'s'}`;
        };
        search?.addEventListener('input',refresh);filter?.addEventListener('change',refresh);refresh();
      }
    } catch(err) {
      console.error(err);
      for (const el of [...containers,...(library?[library]:[])]) {
        const p=document.createElement('p');p.className='library-empty';p.textContent='Resources are temporarily unavailable. Please try again shortly.';el.replaceChildren(p);
      }
    }
  });
})();
