/* Public demo only. No fetch, auth, storage, real companies, or telemetry. */
'use strict';
const today='2026-10-26T08:00:00.000Z';
const supplier={name:'Matériaux Démo',siret:'00000000000000',email:'contact@example.invalid'};
const rows=[
 ['DEMO-BOIS-001','Chevron Douglas 63 × 75','Charpente',980,32],
 ['DEMO-OSB-002','Panneau OSB 3 — 12 mm','Panneaux',1890,11],
 ['DEMO-VIS-003','Vis inox terrasse — boîte 200','Quincaillerie',2490,0],
 ['DEMO-LAM-004','Lame terrasse pin autoclave 4 m','Terrasse',1280,3],
 ['DEMO-TUI-005','Tuile mécanique terre cuite','Couverture',295,124],
 ['DEMO-MOR-006','Mortier colle sac 25 kg','Maçonnerie',1420,8]
];
let products=rows.map((x,i)=>({id:'p'+i,ref:x[0],name:x[1],category:x[2],price:x[3],qty:x[4],mode:'quantity',status:x[4]===0?'out_of_stock':x[4]<=5?'low_stock':'in_stock',archived:false,updated:today,brand:'Démo',unit:'unite'}));
let companies=[{id:'c0',name:'Entreprise fictive ABC',code:'ABC-DEMO',email:'client@example.invalid',siret:'',phone:'',address:'',zip:'',city:''}];
let discounts=[];
let selected=new Set(),page='Dashboard',search='',stockFilter='all',flash='',popup=null,navOpen=false,period=7;
const pages=[['▦','Dashboard'],['▣','Produits'],['♙','Clients professionnels'],['%','Remises'],['▥','Statistiques'],['▤','Documents'],['▱','Archives'],['⚙','Paramètres']];
const names={in_stock:'En stock',low_stock:'Stock faible',out_of_stock:'Rupture',unknown:'Non communiqué'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=n=>(n/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
const money=s=>Math.round(Number(String(s).replace(',','.'))*100);
const stamp=()=>new Date().toISOString();
const id=()=>Math.random().toString(36).slice(2,11);
const status=(p)=>p.mode==='status'?p.status:p.qty===0?'out_of_stock':p.qty<=5?'low_stock':'in_stock';
const saveMessage=m=>{flash=m;render()};
const productById=i=>products.find(p=>p.id===i);
const active=()=>products.filter(p=>!p.archived);
const discountPrice=(p,code)=>{
  const match=discounts.filter(d=>d.customer===code||(!d.customer&&!code)||(!d.customer&&code))
    .filter(d=>d.scope==='all'||(d.scope==='category'&&d.category===p.category)||(d.scope==='selected'&&d.ids.includes(p.id)))
    .sort((a,b)=>((b.customer?10:0)+(b.scope==='selected'?3:b.scope==='category'?2:1))-((a.customer?10:0)+(a.scope==='selected'?3:a.scope==='category'?2:1)));
  const d=match[0];return !d?p.price:Math.min(p.price,Math.max(0,d.mode==='percent'?Math.round(p.price*(100-d.value)/100):d.value));
};
function dashboard(){
 const on=active(),low=on.filter(p=>status(p)==='low_stock'),out=on.filter(p=>status(p)==='out_of_stock');
 return '<div class="title"><div><h1>Bonjour, votre espace fournisseur 👋</h1><p>Gérez votre catalogue simplement, même sans ERP ou site internet.</p></div><button class="primary" data-page="Produits">Gérer mes produits</button></div>'+
 '<div class="tiles">'+[['Produits actifs',on.length],['Stock faible',low.length],['En rupture',out.length],['Clients pros',companies.length]].map(([l,v])=>'<div class="tile"><small>'+esc(l)+'</small><strong>'+v+'</strong></div>').join('')+'</div>'+
 '<div class="split"><div class="panel"><h2>Produits à surveiller</h2>'+[...low,...out].map(p=>'<div class="line"><div><b>'+esc(p.name)+'</b><small class="sub"> '+esc(p.ref)+'</small></div><span class="status '+status(p)+'">'+names[status(p)]+'</span></div>').join('')+(low.length+out.length?'':'<p class="sub">Aucune alerte.</p>')+'</div><div class="panel"><h2>Vos performances</h2><p class="sub">Consultations, ajouts aux devis, factures et commandes.</p><div class="placeholder"><h3>NON BRANCHÉ</h3><p>Les statistiques proviendront exclusivement d’événements réels SpeedArti. Aucun chiffre inventé.</p></div><button class="ghost" data-page="Statistiques">Voir les statistiques</button></div></div>';
}
function productTable(){
 const matches=active().filter(p=>(p.ref+' '+p.name+' '+p.category).toLowerCase().includes(search.toLowerCase())&&(stockFilter==='all'||status(p)===stockFilter));
 return '<div class="title"><div><h1>Mes produits</h1><p>Modifiez les prix, mettez à jour le stock ou archivez vos références.</p></div><button class="primary" data-action="new-product">＋ Nouveau produit</button></div>'+
 '<div class="panel"><div class="toolbar"><input id="search" value="'+esc(search)+'" placeholder="Rechercher un produit…"><button class="ghost" data-action="search">Rechercher</button><select id="stock-filter"><option value="all">Tous les stocks</option>'+Object.keys(names).map(k=>'<option value="'+k+'" '+(stockFilter===k?'selected':'')+'>'+names[k]+'</option>').join('')+'</select><button data-action="bulk-discount" '+(selected.size?'':'disabled')+'>% Remise ('+selected.size+')</button><button data-action="bulk-archive" '+(selected.size?'':'disabled')+'>Archiver</button></div>'+
 '<div class="tablewrap"><table><thead><tr><th>Choix</th><th>Produit / référence</th><th>Prix HT</th><th>Stock</th><th>Disponibilité</th><th>Actions</th></tr></thead><tbody>'+
 matches.map(p=>'<tr><td><input type="checkbox" data-action="select" data-id="'+p.id+'" '+(selected.has(p.id)?'checked':'')+' aria-label="Sélectionner '+esc(p.ref)+'"></td><td><b>'+esc(p.name)+'</b><small>'+esc(p.ref)+' · '+esc(p.category)+'</small></td><td><input class="price" data-action="price" data-id="'+p.id+'" value="'+(p.price/100).toFixed(2).replace('.',',')+'" aria-label="Prix '+esc(p.ref)+'"> €</td><td>'+(p.mode==='quantity'?'<div class="step"><button data-action="minus" data-id="'+p.id+'">−</button><b>'+p.qty+'</b><button data-action="plus" data-id="'+p.id+'">＋</button></div>':'<span class="sub">Par statut</span>')+'</td><td><select data-action="status" data-id="'+p.id+'" class="status '+status(p)+'">'+Object.keys(names).map(s=>'<option value="'+s+'" '+(status(p)===s?'selected':'')+'>'+names[s]+'</option>').join('')+'</select></td><td><div class="actions-row"><button class="ghost" data-action="edit-product" data-id="'+p.id+'">Modifier</button><button class="ghost" data-action="mode" data-id="'+p.id+'">Mode '+(p.mode==='quantity'?'statut':'quantité')+'</button><button class="ghost" data-action="archive" data-id="'+p.id+'">Archiver</button></div></td></tr>').join('')+
 (!matches.length?'<tr><td colspan="6">Aucun produit correspondant.</td></tr>':'')+'</tbody></table></div><p class="note">Données fictives en mémoire, effacées au rechargement. La disponibilité fournisseur n’est jamais ajoutée au stock artisan.</p></div>';
}
function clients(){
 return '<div class="title"><div><h1>Clients professionnels</h1><p>Identifiez les entreprises et associez leurs codes commerciaux.</p></div><button class="primary" data-action="new-client">＋ Nouvelle entreprise</button></div><div class="panel tablewrap"><table><thead><tr><th>Entreprise</th><th>Code client</th><th>E-mail professionnel</th><th>Rattachement</th><th>Actions</th></tr></thead><tbody>'+
 companies.map(c=>'<tr><td><b>'+esc(c.name)+'</b><small>'+esc(c.siret||'SIRET non renseigné')+'</small></td><td><b>'+esc(c.code)+'</b></td><td>'+esc(c.email)+'</td><td><span class="status unknown">NON BRANCHÉ</span></td><td><button class="ghost" data-action="edit-client" data-id="'+c.id+'">Modifier</button></td></tr>').join('')+'</tbody></table></div><p class="note">Le fournisseur n’accède jamais aux noms ou adresses des clients finaux des artisans. Association SpeedArti uniquement après validation.</p>';
}
function rebates(){
 return '<div class="title"><div><h1>Remises et prix négociés</h1><p>Par produit, sélection, catégorie ou catalogue complet ; en % ou prix net.</p></div><button class="primary" data-action="new-discount">＋ Nouvelle remise</button></div>'+
 '<div class="panel tablewrap"><table><thead><tr><th>Règle</th><th>Produits</th><th>Client</th><th>Valeur</th></tr></thead><tbody>'+discounts.map(d=>'<tr><td>'+esc(d.name)+'</td><td>'+esc(d.scope==='all'?'Tous les produits':d.scope==='category'?'Catégorie '+d.category:d.ids.length+' produits')+'</td><td>'+esc(d.customer||'Tous')+'</td><td>'+esc(d.mode==='percent'?d.value+' %':euro(d.value))+'</td></tr>').join('')+(!discounts.length?'<tr><td colspan="4">Aucune remise pour le moment.</td></tr>':'')+'</tbody></table></div>'+
 '<div class="panel"><h2>Aperçu des prix catalogue</h2>'+active().slice(0,4).map(p=>'<div class="line"><span>'+esc(p.name)+'</span><b>'+euro(discountPrice(p,''))+'</b></div>').join('')+'<p class="note">Remises non cumulables. Les prix client spécifiques sont visibles uniquement par l’entreprise autorisée.</p></div>';
}
function stats(){
 return '<div class="title"><div><h1>Statistiques anonymisées</h1><p>Consultations et ajouts confirmés dans les documents.</p></div><div class="toolbar"><button class="ghost" data-action="period" data-days="7">7 jours'+(period===7?' ✓':'')+'</button><button class="ghost" data-action="period" data-days="30">30 jours'+(period===30?' ✓':'')+'</button></div></div><div class="tiles">'+['Consultations','Ajouts au devis','Ajouts à la facture','Ajouts aux commandes'].map(k=>'<div class="tile"><small>'+k+'</small><strong>—</strong></div>').join('')+'</div><div class="panel placeholder"><h3>Statistiques NON BRANCHÉES</h3><p>Seules les actions réellement remontées par les futurs connecteurs SpeedArti pourront alimenter ces indicateurs. Aucun nom de client final, numéro de devis ou adresse de chantier.</p></div>';
}
function archive(){
 const arr=products.filter(p=>p.archived);
 return '<div class="title"><div><h1>Archives</h1><p>Les produits archivés peuvent être restaurés à l’identique.</p></div></div><div class="panel tablewrap"><table><thead><tr><th>Produit</th><th>Référence</th><th>Action</th></tr></thead><tbody>'+arr.map(p=>'<tr><td>'+esc(p.name)+'</td><td>'+esc(p.ref)+'</td><td><button class="ghost" data-action="restore" data-id="'+p.id+'">Restaurer</button></td></tr>').join('')+(!arr.length?'<tr><td colspan="3">Aucun produit archivé.</td></tr>':'')+'</tbody></table></div>';
}
function documents(){return '<div class="title"><div><h1>Fiches techniques et guides de pose</h1><p>Associez photos, notices et guides PDF à chaque produit.</p></div><button class="primary" data-action="upload">＋ Ajouter un document</button></div><div class="panel placeholder"><h3>Stockage sécurisé NON BRANCHÉ</h3><p>Les PDF et photos seront servis par une couche serveur à accès contrôlé. Cette démonstration ne simule aucune mise en ligne.</p></div>'}
function settings(){return '<div class="title"><div><h1>Paramètres fournisseur</h1><p>Identité professionnelle et dépôt principal.</p></div></div><div class="panel fields"><label>Raison sociale<input disabled value="'+esc(supplier.name)+'"></label><label>SIRET<input disabled value="'+esc(supplier.siret)+'"></label><label>E-mail<input disabled value="'+esc(supplier.email)+'"></label><label>Dépot<input disabled value="DEPOT-01"></label><p class="note">Authentification fournisseur et modifications des paramètres : NON BRANCHÉES.</p></div>';}
const views={'Dashboard':dashboard,'Produits':productTable,'Clients professionnels':clients,'Remises':rebates,'Statistiques':stats,'Documents':documents,'Archives':archive,'Paramètres':settings};
function formField(label,name,value='',required=false){return '<label>'+esc(label)+'<input name="'+esc(name)+'" value="'+esc(value)+'" '+(required?'required':'')+'></label>';}
function modalHTML(){
 if(!popup)return '';
 const kind=popup.kind,item=popup.id?(kind==='product'?productById(popup.id):companies.find(c=>c.id===popup.id)):null;
 let fields='';
 if(kind==='product'){
   const p=item||{ref:'',name:'',category:'',brand:'',unit:'unite',price:0,qty:0};
   fields=formField('Référence *','ref',p.ref,true)+formField('Désignation *','name',p.name,true)+formField('Catégorie','category',p.category)+formField('Marque','brand',p.brand)+formField('Prix HT (€) *','price',(p.price/100).toFixed(2),true)+formField('Unité *','unit',p.unit,true)+(item?'':formField('Stock initial','qty','0'));
 }else if(kind==='client'){
   const c=item||{name:'',code:'',email:'',siret:'',phone:'',address:'',zip:'',city:''};
   fields=formField('Raison sociale *','name',c.name,true)+formField('E-mail professionnel *','email',c.email,true)+formField('SIRET','siret',c.siret)+formField('Téléphone','phone',c.phone)+formField('Adresse','address',c.address)+formField('Code postal','zip',c.zip)+formField('Ville','city',c.city)+formField('Code client *','code',c.code,true);
 }else{
   fields=formField('Nom de la remise *','name','',true)+'<label>Périmètre<select name="scope"><option value="all">Tous les produits</option><option value="category">Par catégorie</option><option value="selected" '+(popup.selected?'selected':'')+'>Sélection actuelle ('+selected.size+')</option></select></label>'+
   formField('Catégorie (si applicable)','category')+'<label>Code client<select name="customer"><option value="">Tous les clients</option>'+companies.map(c=>'<option value="'+esc(c.code)+'">'+esc(c.name)+'</option>').join('')+'</select></label>'+
   '<label>Type<select name="mode"><option value="percent">Remise en %</option><option value="net">Prix net HT (€)</option></select></label>'+formField('Valeur *','value','5',true);
 }
 return '<div class="backdrop" id="backdrop"><div class="dialog" role="dialog" aria-modal="true"><div class="dialogtop"><h2>'+esc(kind==='product'?(item?'Modifier le produit':'Nouveau produit'):kind==='client'?'Fiche entreprise':'Nouvelle remise')+'</h2><button data-action="close" aria-label="Fermer">×</button></div><form id="edit-form" class="fields">'+fields+'<div class="formfooter">'+(kind==='client'?'<button type="button" data-action="code">Générer le code</button>':'')+'<button type="button" data-action="close">Annuler</button><button class="primary" type="submit">Enregistrer</button></div></form></div></div>';
}
function render(){
 document.getElementById('app').innerHTML='<aside class="sidebar '+(navOpen?'open':'')+'"><div class="brand"><span class="s">S</span><div><b>SpeedArti</b><small>Espace fournisseur</small></div></div><div class="vendor"><b>Matériaux Démo</b><small>Fournisseur fictif · dépôt 01</small></div><nav class="nav">'+pages.map(([icon,name])=>'<button class="'+(page===name?'sel':'')+'" data-page="'+esc(name)+'"><span class="emoji">'+icon+'</span>'+name+(name==='Archives'&&products.filter(p=>p.archived).length?' ('+products.filter(p=>p.archived).length+')':'')+'</button>').join('')+'</nav><div class="bottom"><b>Mode démonstration</b><br>Aucune sauvegarde serveur.</div></aside>'+
 (navOpen?'<button class="shade" data-action="menu-close" aria-label="Fermer la navigation"></button>':'')+'<div class="right"><header class="top"><button class="menu" data-action="menu">☰</button><div><b>'+page+'</b><small>Gestion fournisseur</small></div><span class="pill">● Démo fictive</span></header><main class="content">'+(flash?'<div class="alert">'+esc(flash)+'<button data-action="clear">×</button></div>':'')+views[page]()+'</main></div>'+modalHTML();
}
document.addEventListener('click',function(e){
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page){page=b.dataset.page;navOpen=false;render();return;}
 const a=b.dataset.action,idv=b.dataset.id,p=productById(idv);
 if(a==='menu'){navOpen=true;render();return}
 if(a==='menu-close'){navOpen=false;render();return}
 if(a==='clear'){flash='';render();return}
 if(a==='new-product'){popup={kind:'product'};render();return}
 if(a==='edit-product'){popup={kind:'product',id:idv};render();return}
 if(a==='new-client'){popup={kind:'client'};render();return}
 if(a==='edit-client'){popup={kind:'client',id:idv};render();return}
 if(a==='new-discount'){popup={kind:'discount'};render();return}
 if(a==='bulk-discount'){if(!selected.size)return;popup={kind:'discount',selected:true};render();return}
 if(a==='close'){popup=null;render();return}
 if(a==='code'){
   const form=document.getElementById('edit-form');const root=String(form.elements.namedItem('name').value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'').toUpperCase().slice(0,10)||'CLIENT';
   let candidate=root,i=2;while(companies.some(c=>c.code===candidate&&c.id!==popup.id)){candidate=root+'-'+i++;}
   form.elements.namedItem('code').value=candidate;return;
 }
 if(a==='search'){search=document.getElementById('search').value;render();return}
 if(a==='period'){period=Number(b.dataset.days);render();return}
 if(a==='upload'){saveMessage('NON BRANCHÉ : stockage PDF privé nécessaire.');return}
 if(a==='plus'||a==='minus'){
   if(p.mode!=='quantity')return;
   const n=p.qty+(a==='plus'?1:-1);if(n<0){saveMessage('Stock négatif interdit.');return;}
   p.qty=n;p.status=status(p);p.updated=stamp();render();return;
 }
 if(a==='mode'){p.mode=p.mode==='quantity'?'status':'quantity';if(p.mode==='status')p.qty=null;else p.qty=0;p.status=status(p);p.updated=stamp();render();return}
 if(a==='archive'||a==='bulk-archive'){
   const ids=a==='archive'?[idv]:[...selected];if(!ids.length)return;
   if(!confirm('Archiver '+ids.length+' produit(s) ? Restauration possible.'))return;
   ids.forEach(i=>{const v=productById(i);if(v)v.archived=true;});selected.clear();render();return;
 }
 if(a==='restore'){p.archived=false;render();return}
});
document.addEventListener('change',function(e){
 const el=e.target,a=el.dataset.action,idv=el.dataset.id,p=productById(idv);
 if(el.id==='stock-filter'){stockFilter=el.value;render();return}
 if(a==='select'){el.checked?selected.add(idv):selected.delete(idv);render();return}
 if(a==='status'){p.mode='status';p.qty=null;p.status=el.value;p.updated=stamp();render();return}
 if(a==='price'){const v=money(el.value);if(!Number.isSafeInteger(v)||v<0){saveMessage('Prix HT invalide');return;}p.price=v;render();return;}
});
document.addEventListener('submit',function(e){
 if(e.target.id!=='edit-form')return;
 e.preventDefault();const data=Object.fromEntries(new FormData(e.target));
 const k=popup.kind;
 if(k==='product'){
   const v=money(data.price),quantity=Number(data.qty||0);if(!Number.isSafeInteger(v)||v<0){saveMessage('Prix HT invalide');return}
   const existing=products.find(p=>p.ref.toUpperCase()===String(data.ref).trim().toUpperCase()&&p.id!==popup.id);
   if(existing){saveMessage('Référence déjà existante');return}
   if(!popup.id&&(!Number.isSafeInteger(quantity)||quantity<0)){saveMessage('Stock initial invalide');return}
   if(popup.id){const p=productById(popup.id);Object.assign(p,{ref:String(data.ref).trim().toUpperCase(),name:data.name,category:data.category||'Divers',brand:data.brand,price:v,unit:data.unit,updated:stamp()});}
   else {products.unshift({id:id(),ref:String(data.ref).trim().toUpperCase(),name:data.name,category:data.category||'Divers',brand:data.brand,price:v,unit:data.unit,qty:quantity,mode:'quantity',status:quantity===0?'out_of_stock':quantity<=5?'low_stock':'in_stock',updated:stamp(),archived:false});}
 }else if(k==='client'){
   const code=String(data.code).toUpperCase().trim(),email=String(data.email).trim(),siret=String(data.siret).replace(/\s/g,'');
   if(!code||companies.some(c=>c.code===code&&c.id!==popup.id)){saveMessage('Code client déjà utilisé ou invalide');return}
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){saveMessage('E-mail invalide');return}
   if(siret&&!/^\d{14}$/.test(siret)){saveMessage('SIRET : 14 chiffres');return}
   const company={id:popup.id||id(),name:data.name,email,code,siret,phone:data.phone,address:data.address,zip:data.zip,city:data.city};
   if(popup.id)Object.assign(companies.find(c=>c.id===popup.id),company);else companies.push(company);
 }else {
   const value=data.mode==='percent'?Number(data.value):money(data.value);
   if(!Number.isFinite(value)||value<0||(data.mode==='percent'&&value>100)){saveMessage('Valeur de remise invalide');return}
   if(data.scope==='category'&&!data.category){saveMessage('Catégorie obligatoire');return}
   if(data.scope==='selected'&&!selected.size){saveMessage('Aucun produit sélectionné');return}
   discounts.push({id:id(),name:data.name,scope:data.scope,category:data.category,customer:data.customer,mode:data.mode,value,ids:[...selected]});
 }
 popup=null;flash='Enregistré dans la démo en mémoire uniquement';render();
});
render();
