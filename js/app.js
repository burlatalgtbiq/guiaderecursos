(()=>{
const M=document.getElementById('main'),$=s=>document.querySelector(s);
let D,T,lang='es';
const LANGS=['es','eu','ar'],RTL=['ar'];
const NAMES={es:'Castellano',eu:'Euskara',ar:'العربية'};
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=k=>T[lang]?.[k]??T.es[k]??k;
const L=o=>o==null?'':typeof o==='string'?o:(o[lang]||o.es||'');
const LA=o=>Array.isArray(o)?o:(o?.[lang]||o?.es||[]);
const safe=u=>/^https?:\/\//i.test(u)?u:'#';
const href=(...a)=>'#/'+[lang,...a].join('/');
const cats=()=>D.c.categories,catOf=id=>cats().find(c=>c.id===id)||{},
 subOf=(cid,id)=>(catOf(cid).subs||[]).find(s=>s.id===id)||{},
 byId=(arr,id)=>D.c[arr].find(x=>x.id===id)||{};
 const subList=r=>[].concat(r.subcategory||[]).map(id=>L(subOf(r.category,id).name)).filter(Boolean);
const langBtns=rest=>LANGS.map(l=>`<a href="#/${l}/${rest}" lang="${l}" hreflang="${l}"${l===lang?' aria-current="true"':''}>${NAMES[l]}</a>`).join('');
function route(){
 let h=location.hash.replace(/^#\/?/,''),[p,qs]=h.split('?'),seg=p.split('/').filter(Boolean),l=lang;
 if(LANGS.includes(seg[0]))l=seg.shift();
 return{l,seg,rest:seg.join('/')+(qs?'?'+qs:''),q:Object.fromEntries(new URLSearchParams(qs||''))}}
function chrome(r){
 $('#skip').textContent=t('skip');
 const b=$('#brand');b.href=href();b.innerHTML=`<img src="assets/logo.svg" alt="" width="44" height="44"><span><strong>${esc(t('title'))}</strong><small>Burlada/Burlata</small></span>`;
 $('#nav').setAttribute('aria-label','Principal');$('#menu').setAttribute('aria-label',t('menu'));$('#nav').hidden=true;$('#menu').setAttribute('aria-expanded','false');
 $('#nav').innerHTML=`<a href="${href()}"${!r.seg[0]?' aria-current="page"':''}>${t('home')}</a>`+cats().map(c=>`<a href="${href('categoria',c.id)}"${r.seg[1]===c.id&&r.seg[0]==='categoria'?' aria-current="page"':''}>${esc(L(c.name))}</a>`).join('')+`<a href="${href('buscar')}"${r.seg[0]==='buscar'?' aria-current="page"':''}>${t('search')}</a>`;
 $('#langs').setAttribute('role','group');$('#langs').setAttribute('aria-label','Idioma / Hizkuntza / اللغة');
 $('#langbtn').setAttribute('aria-label',t('chooseLang'));$('#langtxt').textContent=t('chooseLang');
$('#langs').hidden=true;$('#langbtn').setAttribute('aria-expanded','false');
 $('#langs').innerHTML=langBtns(r.rest);
 $('#foot').innerHTML=`<img src="assets/logo-ayuntamiento.png" alt="Ayuntamiento de Burlada/Burlata" onerror="this.remove()"><span>${esc(t('foot'))}</span>`;$('#exit').textContent='✕ '+t('exit');$('#exit').setAttribute('aria-label',t('exitL'));}
const card=r=>{const c=catOf(r.category);return`<li class="card" style="--c:${c.color}"><h3><a href="${href('recurso',r.id)}">${esc(L(r.name))}</a></h3><p class="meta">${esc(L(c.name))} — ${esc(subList(r).join(', '))}</p><p class="desc">${esc(L(r.description))}</p><p class="tags">${(r.audiences||[]).map(a=>`<span class="tag">${esc(L(byId('audiences',a).name))}</span>`).join('')}</p></li>`};
const featCard=r=>{const c=catOf(r.category);return`<li class="fcard" style="--c:${c.color}"><p class="pill">${esc(L(c.name))}</p><div class="frow">${r.logo?`<img src="${esc(r.logo)}" alt="" loading="lazy">`:''}<div><h3><a href="${href('recurso',r.id)}">${esc(L(r.name))}</a></h3><p>${esc(L(r.description))}</p></div></div></li>`};
function home(){
 const f=D.r.filter(r=>r.featured);
 M.innerHTML=`<section class="hero"><div class="wrap"><h1>${esc(t('title'))}<br>Burlada/Burlata</h1><p>${esc(t('intro'))}</p>
 <form class="sform" role="search"><label class="vh" for="q">${t('search')}</label><input id="q" type="search" placeholder="${esc(t('ph'))}"><button>${t('go')}</button></form></div></section>
 <div class="wrap"><h2>${t('cats')}</h2><ul class="grid catgrid">${cats().map(c=>`<li><a class="cat" style="--c:${c.color}" href="${href('categoria',c.id)}">${c.image?`<img src="${esc(c.image)}" alt="" loading="lazy">`:`<span class="ic" aria-hidden="true">${c.icon}</span>`}<div><h3>${esc(L(c.name))}</h3><p>${esc(L(c.desc))}</p></div></a></li>`).join('')}</ul>
 <h2>${t('feat')}</h2><ul class="grid featgrid">${f.map(featCard).join('')}</ul></div>`;
 $('form').onsubmit=e=>{e.preventDefault();location.hash=href('buscar')+'?q='+encodeURIComponent($('#q').value)}}
function list(c,q,intro){
 const opt=(arr,k,sel)=>`<option value="">${t('all')}</option>`+arr.map(x=>`<option value="${x.id}"${sel===x.id?' selected':''}>${esc(L(x.name))}</option>`).join('');
 const subs=(c?[c]:cats()).map(k=>`<optgroup label="${esc(L(k.name))}">${k.subs.map(s=>`<option value="${s.id}"${q.sub===s.id?' selected':''}>${esc(L(s.name))}</option>`).join('')}</optgroup>`).join('');
 const head=`${intro||`<h1>${t('search')}</h1>`}
 <form id="f" class="filters" role="search"><label>${t('fq')}<input name="q" type="search" value="${esc(q.q||'')}"></label>
 ${c?'':`<label>${t('fc')}<select name="cat">${opt(cats(),'',q.cat)}</select></label>`}
 <label>${t('fs')}<select name="sub"><option value="">${t('all')}</option>${subs}</select></label>
 <label>${t('fa')}<select name="aud">${opt(D.c.audiences,'',q.aud)}</select></label>
 <label>${t('fo')}<select name="scope">${opt(D.c.scopes,'',q.scope)}</select></label></form>`;
 const body=`<p id="cnt" role="status" aria-live="polite" class="meta"></p><ul id="res" class="grid"></ul>`;
 M.innerHTML=c?`<section class="catbox" style="--c:${c.color}"><div class="wrap">${head}</div></section><div class="wrap">${body}</div>`:`<div class="wrap">${head}${body}</div>`;
 const form=$('#f');
 const hay=r=>r._h||(r._h=norm(JSON.stringify([r.name,r.description,r.services,r.tags,r.keywords,r.address])+[catOf(r.category).name,...[].concat(r.subcategory||[]).map(s=>subOf(r.category,s).name),...(r.audiences||[]).map(a=>byId('audiences',a).name),byId('scopes',r.scope).name].map(o=>JSON.stringify(o)).join(' ')));
 const upd=()=>{
  const v=Object.fromEntries(new FormData(form));if(c)v.cat=c.id;
  const toks=norm(v.q).split(/\s+/).filter(Boolean);
  const out=D.r.filter(r=>(!v.cat||r.category===v.cat)&&(!v.sub||[].concat(r.subcategory).includes(v.sub))&&(!v.aud||(r.audiences||[]).includes(v.aud))&&(!v.scope||r.scope===v.scope)&&toks.every(k=>hay(r).includes(k)));
  $('#cnt').textContent=`${out.length} ${t('res')}`;
  $('#res').innerHTML=out.length?out.map(card).join(''):`<li>${t('none')}</li>`;
  const p=new URLSearchParams();for(const[k,x]of Object.entries(v))if(x&&!(c&&k==='cat'))p.set(k,x);
  history.replaceState(null,'','#/'+lang+'/'+(c?'categoria/'+c.id:'buscar')+(p.size?'?'+p:''));
  $('#langs').innerHTML=langBtns(route().rest)};
 form.oninput=upd;form.onsubmit=e=>e.preventDefault();upd()}
function cat(id,q){
 const c=cats().find(x=>x.id===id);if(!c)return nf();
 document.title=L(c.name)+' · '+t('title');
 list(c,q,`<h1>${c.icon} ${esc(L(c.name))}</h1><p style="max-width:60ch">${esc(L(c.desc))}</p>`);}
const nf=()=>{M.innerHTML=`<div class="wrap"><p>${t('nf')}</p><a class="btn" href="${href()}">${t('home')}</a></div>`};
function res(id){
 const r=D.r.find(x=>x.id===id);if(!r)return nf();const c=catOf(r.category);
 document.title=L(r.name)+' · '+t('title');
 const row=(k,v)=>v?`<dt>${t(k)}</dt><dd>${v}</dd>`:'';
 const svc=LA(r.services),tags=LA(r.tags),soc=r.social||[];
 const mapU=r.map||(r.address?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.address):'');
 const act=(h,l,alt)=>h?`<a class="btn${alt?' alt':''}" href="${esc(h)}"${/^https?/.test(h)?' rel="noopener" target="_blank"':''}>${l}</a>`:'';
 const info=[['addr',esc(r.address)],['tel',r.phone&&`<a href="tel:${esc(r.phone.replace(/[^+\d]/g,''))}" dir="ltr">${esc(r.phone)}</a>`],['sch',esc(L(r.schedule))]].filter(x=>x[1]).map(([k,v])=>`<div><dt>${t(k)}</dt><dd>${v}</dd></div>`).join('');
 const pills=[L(c.name),...subList(r)].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
  M.innerHTML=`<section class="headbox" style="--c:${c.color}"><div class="wrap"><p><a href="${href('categoria',r.category)}">← ${t('back')}: ${esc(L(c.name))}</a></p>
<div class="headrow"><h1>${esc(L(r.name))}</h1><div class="side"><p class="pills">${pills}</p>${r.logo?`<img class="rlogo" src="${esc(r.logo)}" alt="">`:''}</div></div>
 ${L(r.description)?`<hr class="sep"><p class="lead">${esc(L(r.description))}</p>`:''}</div></section>
 ${info?`<section class="catbox" style="--c:${c.color}"><div class="wrap"><dl class="facts">${info}</dl></div></section>`:''}
 <article class="wrap" style="--c:${c.color}">
 ${r.demo?`<p class="note">${t('demo')}</p>`:''}
 <div class="acts">${act(r.phone&&'tel:'+r.phone.replace(/[^+\d]/g,''),'📞 '+t('call'))}${act(r.email&&'mailto:'+r.email,'✉️ '+t('write'),1)}${act(r.web&&safe(r.web),'🌐 '+t('visit'),1)}${act(mapU,'📍 '+t('map'),1)}</div>
 <dl>${row('svc',svc.length?`<ul>${svc.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:'')}${row('mail',r.email&&`<a href="mailto:${esc(r.email)}" dir="ltr">${esc(r.email)}</a>`)}${row('web',r.web&&`<a href="${esc(safe(r.web))}" rel="noopener" dir="ltr">${esc(r.web)}</a>`)}${row('soc',soc.map(s=>`<a href="${esc(safe(s.u))}" rel="noopener">${esc(s.n)}</a>`).join(' · '))}${row('acc',esc(L(r.access)))}${row('aud',(r.audiences||[]).map(a=>esc(L(byId('audiences',a).name))).join(', '))}${row('sc',esc(L(byId('scopes',r.scope).name)))}${row('tags',tags.map(x=>`<span class="tag">${esc(x)}</span>`).join(''))}</dl></article>`}
function render(){
 const r=route();lang=r.l;document.documentElement.lang=lang;document.documentElement.dir=RTL.includes(lang)?'rtl':'ltr';document.title=t('title')+' · Burlada/Burlata';
 chrome(r);const[v,id]=r.seg;
 v==='categoria'?cat(id,r.q):v==='recurso'?res(id):v==='buscar'?list(null,r.q):v?nf():home();
 if(!r.fromInit)M.focus({preventScroll:true});scrollTo(0,0)}
(async()=>{try{
 const[c,x,i]=await Promise.all(['categories','resources','i18n'].map(n=>fetch(`data/${n}.json`,{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()})));
 D={c,r:x.resources.filter(r=>r.active!==false)};T=i}catch(e){M.innerHTML='<p class="wrap">Error: abre el sitio desde un servidor web / Ireki gunea web zerbitzari batetik.</p>';return}
 $('#exit').onclick=()=>{try{window.close()}catch(e){}location.replace('https://www.google.es')};
 $('#menu').onclick=()=>{const n=$('#nav'),o=n.hidden;n.hidden=!o;$('#menu').setAttribute('aria-expanded',o)};
$('#langbtn').onclick=e=>{e.stopPropagation();const l=$('#langs'),o=l.hidden;l.hidden=!o;$('#langbtn').setAttribute('aria-expanded',o)};
addEventListener('click',e=>{if(!e.target.closest('.langwrap')||e.target.closest('#langs a')){$('#langs').hidden=true;$('#langbtn').setAttribute('aria-expanded','false')}});
addEventListener('keydown',e=>{if(e.key!=='Escape')return;
 if(!$('#langs').hidden){$('#langs').hidden=true;$('#langbtn').setAttribute('aria-expanded','false');$('#langbtn').focus()}
 else if(!$('#nav').hidden){$('#nav').hidden=true;$('#menu').setAttribute('aria-expanded','false');$('#menu').focus()}}); addEventListener('hashchange',render);render()})();
})();

