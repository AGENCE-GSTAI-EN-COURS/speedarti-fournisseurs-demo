/* Public demo only. No fetch, auth, storage, real companies, or telemetry. */
'use strict';
const today='2026-10-26T08:00:00.000Z';
const supplier={name:'Matériaux Démo',siret:'00000000000000',email:'contact@example.invalid'};
/* Demo category snapshot only; authoritative SpeedArti categories are dynamic (productsService.getCategories). */
const CATALOGUE_CATEGORIES=['Charpente','Panneaux','Quincaillerie','Terrasse','Couverture','Maçonnerie'];
/* Supplier-only proposed categories: NOT a canonical SpeedArti V2 category endpoint. */
const CATALOGUE_METIERS=[{"trade":"Charpente et construction bois","categories":["Bois massif","Bois de structure","Bois lamellé-collé","Fermettes","Poutres et solives","Connecteurs et sabots","Fixations de charpente","Panneaux OSB","Panneaux techniques","Traitement du bois"]},{"trade":"Couverture","categories":["Tuiles terre cuite","Tuiles béton","Ardoises","Bacs acier","Plaques ondulées","Écrans sous-toiture","Faîtages et arêtiers","Rives et accessoires","Fenêtres de toit","Accessoires de ventilation","Accessoires de sécurité"]},{"trade":"Zinguerie","categories":["Zinc","Gouttières et descentes","Chéneaux","Solins et abergements","Couvertines","Bavettes","Crochets et fixations","Cuivre","Aluminium façonné"]},{"trade":"Étanchéité","categories":["Membranes bitumineuses","Membranes EPDM","Membranes PVC et TPO","Résines d’étanchéité","Pare-vapeur","Relevés et bandes","Évacuations de toiture","Étanchéité terrasse"]},{"trade":"Maçonnerie et gros œuvre","categories":["Ciments et liants","Béton et mortiers","Briques","Parpaings","Blocs isolants","Coffrage","Armatures et treillis","Linteaux et chaînages","Appuis de fenêtre et seuils","Fondations et soubassements","Chimie du bâtiment"]},{"trade":"Terrassement et VRD","categories":["Granulats et remblais","Géotextiles","Tuyaux et gaines","Canalisations EP et EU","Regards et tampons","Drainage","Bordures","Pavés de voirie","Blindage et soutènement","Assainissement collectif"]},{"trade":"Assainissement non collectif","categories":["Fosses toutes eaux","Microstations","Filtres compacts","Épandage","Pompes de relevage","Ventilations","Regards et accessoires","Matériaux filtrants"]},{"trade":"Plomberie et sanitaire","categories":["Tubes cuivre","Tubes PER et multicouche","Raccords","Robinetterie","Éviers et lavabos","WC et bâti-supports","Douches et baignoires","Évacuation PVC","Traitement de l’eau","Accessoires sanitaires"]},{"trade":"Chauffage","categories":["Chaudières","Pompes à chaleur","Radiateurs","Planchers chauffants","Circulateurs","Vannes et régulation","Ballons d’eau chaude","Tuyauterie chauffage","Conduits et fumisterie"]},{"trade":"Climatisation et froid","categories":["Climatiseurs monosplit","Climatiseurs multisplit","Unités intérieures","Unités extérieures","Liaisons frigorifiques","Évacuation condensats","Fixations et supports","Ventilation frigorifique"]},{"trade":"Ventilation et VMC","categories":["VMC simple flux","VMC double flux","Bouches d’extraction","Gaines et conduits","Entrées d’air","Caissons et ventilateurs","Grilles et accessoires"]},{"trade":"Électricité","categories":["Fils et câbles","Gaines et tubes","Prises et interrupteurs","Tableaux électriques","Disjoncteurs et protections","Appareillage encastré","Éclairage","Domotique","Mise à la terre","Courants faibles","Coffrets et boîtes"]},{"trade":"Photovoltaïque et solaire","categories":["Panneaux photovoltaïques","Onduleurs","Micro-onduleurs","Fixations en toiture","Batteries de stockage","Câblage solaire","Protections électriques","Chauffe-eau solaires"]},{"trade":"Menuiserie intérieure","categories":["Portes intérieures","Blocs-portes","Huisseries","Plinthes et moulures","Quincaillerie de porte","Escaliers","Aménagement de placard","Panneaux décoratifs"]},{"trade":"Menuiserie extérieure","categories":["Fenêtres PVC","Fenêtres aluminium","Fenêtres bois","Portes d’entrée","Baies coulissantes","Volets roulants","Volets battants","Portes de garage","Vitrages","Joints et accessoires"]},{"trade":"Serrurerie et métallerie","categories":["Profilés acier","Tôles","Garde-corps","Portails et clôtures","Serrures et cylindres","Ferrures","Soudures et consommables","Fixations métalliques"]},{"trade":"Plâtrerie et plaques de plâtre","categories":["Plaques BA13","Plaques hydrofuges","Plaques coupe-feu","Rails et montants","Ossatures de plafond","Enduits à joints","Bandes à joints","Vis et accessoires","Trappes de visite"]},{"trade":"Isolation","categories":["Laine de verre","Laine de roche","Fibre de bois","Ouate de cellulose","Polystyrène","Polyuréthane","Isolation toiture","Isolation murs","Isolation sols","Frein-vapeur","Membranes d’étanchéité à l’air"]},{"trade":"Façade et ITE","categories":["Enduits de façade","Sous-enduits","Treillis et armatures","Baguettes et profilés","Isolants ITE","Colles et chevilles ITE","Bardage de façade","Peintures de façade","Parements"]},{"trade":"Peinture et décoration","categories":["Peintures intérieures","Peintures extérieures","Sous-couches","Enduits de préparation","Laques et vernis","Revêtements décoratifs","Papier peint","Outils du peintre","Bâches et protections"]},{"trade":"Carrelage et faïence","categories":["Carrelage sols","Faïence murale","Grès cérame","Colles à carrelage","Joints","Profilés et plinthes","Étanchéité sous carrelage","Accessoires de pose"]},{"trade":"Sols souples et parquet","categories":["Parquet massif","Parquet contrecollé","Sol stratifié","Sol PVC et LVT","Linoléum","Moquette","Sous-couches","Plinthes","Colles et ragréages"]},{"trade":"Cloisons et plafonds","categories":["Cloisons modulaires","Faux plafonds","Dalles de plafond","Ossatures","Panneaux acoustiques","Trappes et accessoires","Séparation légère"]},{"trade":"Bardage","categories":["Bardage bois","Bardage composite","Bardage métallique","Bardage PVC","Ossatures et tasseaux","Pare-pluie","Fixations de bardage","Habillages"]},{"trade":"Paysage et espaces verts","categories":["Végétaux","Terre végétale et terreaux","Paillages","Géotextiles paysagers","Arrosage","Clôtures","Bordures de jardin","Dalles et pavés","Éclairage extérieur"]},{"trade":"Aménagements extérieurs","categories":["Lames de terrasse","Plots et lambourdes","Pergolas","Terrasses sur plots","Terrasses bois","Clôtures et claustras","Garde-corps","Portails et motorisations"]},{"trade":"Piscines","categories":["Coques et bassins","Filtration","Pompes","Traitement de l’eau","Tuyauterie piscine","Revêtements et liners","Margelles","Sécurité et couvertures"]},{"trade":"Cuisine et agencement","categories":["Meubles de cuisine","Plans de travail","Éviers et mitigeurs","Crédences","Accessoires d’agencement","Quincaillerie de meuble","Panneaux d’agencement"]},{"trade":"Démolition et déconstruction","categories":["Consommables de démolition","Disques et lames","Bennes et big bags","Protection du chantier","Tri et évacuation","Déconstruction sélective"]},{"trade":"Quincaillerie et fixation","categories":["Visserie","Boulonnerie","Chevilles","Clous et pointes","Équerres et sabots","Colles et mastics","Adhésifs et joints","Charnières et ferrures"]},{"trade":"Outillage et équipement","categories":["Outillage électroportatif","Outillage à main","Lames et forets","Mesure et traçage","Échafaudages et accès","EPI","Consommables","Matériel de chantier"]},{"trade":"Sécurité et incendie","categories":["Extincteurs","Détection incendie","Portes coupe-feu","Signalétique","Désenfumage","Systèmes de sûreté","Alarmes"]},{"trade":"Accessibilité et mobilité","categories":["Rampes PMR","Barres d’appui","Élévateurs","Mains courantes","Seuils adaptés","Équipements sanitaires PMR"]},{"trade":"Fournitures et consommables","categories":["Nettoyants","Produits d’entretien","Protection de chantier","Sacs et emballages","Consommables généraux","Fournitures diverses"]},{"trade":"Autres métiers","categories":["Matériaux spécifiques","Accessoires spécifiques","Équipements particuliers"]}];
const categoryValuesForTrade=(trade)=>trade==='__legacy__'?CATALOGUE_CATEGORIES:(CATALOGUE_METIERS.find(g=>g.trade===trade)?.categories.map(c=>trade+' / '+c)||[]);
function tradeForCategory(category){return !category?'':CATALOGUE_CATEGORIES.includes(category)?'__legacy__':CATALOGUE_METIERS.find(g=>category.startsWith(g.trade+' / '))?.trade||'__other__';}
function categoryOptionsHtml(trade,selected){
 return '<option value="">Choisir une catégorie</option>'+categoryValuesForTrade(trade).map(v=>'<option value="'+esc(v)+'" '+(v===selected?'selected':'')+'>'+esc(v.startsWith(trade+' / ')?v.slice(trade.length+3):v)+'</option>').join('')+
 '<option value="__custom__" '+(selected==='__custom__'?'selected':'')+'>＋ Catégorie personnalisée</option>';
}
function toggleCustomCategory(){
 const c=document.getElementById('category-select'),field=document.getElementById('custom-category-field');
 if(!c||!field)return;
 field.hidden=c.value!=='__custom__';field.querySelector('input').required=!field.hidden;
}

const SPEEDARTI_UNITS=['m2','ml','unite','heure','forfait','kg','m3','lot','sac','tonne','u','barre','panneau','tole','boite','cartouche','pot','rouleau','big_bag','botte','volee','marche'];
const PHOTO_MIME=['image/jpeg','image/png','image/webp'];
const PHOTO_MAX=5*1024*1024,PDF_MAX=10*1024*1024;
function validateSelectedFiles(photo,pdfs){
 if(photo && (!PHOTO_MIME.includes(photo.type)||photo.size<=0||photo.size>PHOTO_MAX))throw Error('Photo : JPG, PNG ou WebP, 5 Mo maximum.');
 for(const file of pdfs)if(file.type!=='application/pdf'||file.size<=0||file.size>PDF_MAX)throw Error('Documents : PDF de 10 Mo maximum par fichier.');
}

const rows=[
 ['DEMO-BOIS-001','Chevron Douglas 63 × 75','Charpente',980,32],
 ['DEMO-OSB-002','Panneau OSB 3 — 12 mm','Panneaux',1890,11],
 ['DEMO-VIS-003','Vis inox terrasse — boîte 200','Quincaillerie',2490,0],
 ['DEMO-LAM-004','Lame terrasse pin autoclave 4 m','Terrasse',1280,3],
 ['DEMO-TUI-005','Tuile mécanique terre cuite','Couverture',295,124],
 ['DEMO-MOR-006','Mortier colle sac 25 kg','Maçonnerie',1420,8]
];
let products=rows.map((x,i)=>({id:'p'+i,ref:x[0],name:x[1],category:x[2],price:x[3],qty:x[4],mode:'quantity',status:x[4]===0?'out_of_stock':x[4]<=5?'low_stock':'in_stock',archived:false,updated:today,brand:'Démo',unit:'unite',photo:null,documents:[]}));
let companies=[{id:'c0',name:'Entreprise fictive ABC',code:'ABC-DEMO',email:'client@example.invalid',siret:'',phone:'',address:'',zip:'',city:''}];
let discounts=[];
let pendingLinks=[];
let importOpen=false,importTable=null,importPlan=[],importMessage='';
let importOptions={auto:true,prefix:'MAT',update:false,defaultCategory:''};
let stockRefreshPlan={source:'manual_upload',cadence:'manual',saved:false},stockOnlyRows=[],stockOnlyNotice='';
let demoAgency='DEPOT-01',branchStocks=new Map(),syncSnapshots={},syncHistory=[];
let demoUnlocked=false;
let selected=new Set(),page='Dashboard',search='',stockFilter='all',flash='',popup=null,navOpen=false,period=7,documentSearch='';
const pages=[['▦','Dashboard'],['▣','Produits'],['♙','Clients professionnels'],['⇄','Connexions SpeedArti'],['↻','Synchronisations'],['▤','Stocks par agence'],['%','Remises'],['▥','Statistiques'],['▤','Documents'],['▱','Archives'],['⚙','Paramètres']];
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
function suggestPublicReference(prefix='MAT'){
 const re=new RegExp('^'+prefix+'-([0-9]{1,8})$');let max=0;
 for(const p of products){const m=p.ref.toUpperCase().match(re);if(m)max=Math.max(max,Number(m[1]));}
 return prefix+'-'+String(max+1).padStart(6,'0');
}
function importPanelHtml(){
 const template='Référence;Désignation;Prix HT;Marque;Catégorie;Stock\r\n;Exemple fictif;9,80;Marque Démo;Charpente / Bois massif;32';
 const valid=importPlan.filter(r=>r.action==='create'||r.action==='update');
 const errors=importPlan.filter(r=>r.action==='error');
 const categories=CATALOGUE_METIERS.flatMap(g=>g.categories.map(c=>g.trade+' / '+c));
 return '<section class="panel import-demo" aria-label="Importation CSV et références automatiques"><h2>Importer des produits en masse</h2>'+
  '<p class="sub">Excel .xlsx, CSV (virgule ou point-virgule) et TSV — lecture locale. Aucun fichier n\'est envoyé à SpeedArti.</p>'+
  '<div class="toolbar"><input id="import-file" type="file" accept=".xlsx,.csv,.tsv,.txt" aria-label="Catalogue Excel CSV ou TSV">'+
  '<a class="import-template" download="modele-fournisseur.csv" href="data:text/csv;charset=utf-8,'+encodeURIComponent(template)+'">Télécharger le modèle CSV</a></div>'+
  '<div class="import-controls"><label>Catégorie si absente<select id="import-default-category"><option value="">Ne pas inventer de catégorie</option>'+
  [...CATALOGUE_CATEGORIES,...categories].map(c=>'<option value="'+esc(c)+'" '+(c===importOptions.defaultCategory?'selected':'')+'>'+esc(c)+'</option>').join('')+
  '</select></label><label>Préfixe de référence<input id="import-prefix" aria-label="Préfixe import" maxlength="8" value="'+esc(importOptions.prefix)+'"></label>'+
  '<label>Doublons<select id="import-duplicate"><option value="skip" '+(!importOptions.update?'selected':'')+'>Ne pas modifier</option><option value="update" '+(importOptions.update?'selected':'')+'>Mettre à jour</option></select></label>'+
  '<label class="import-checkbox"><input id="import-auto" type="checkbox" '+(importOptions.auto?'checked':'')+'> Générer les références absentes</label></div>'+
  '<button class="ghost" data-action="import-preview" '+(importTable?'':'disabled')+'>Vérifier le fichier</button>'+
  (importMessage?'<p class="import-message" role="status">'+esc(importMessage)+'</p>':'')+
  (importTable?'<p class="sub">Fichier chargé : '+(importTable.length-1)+' ligne(s). Aperçu local seulement.</p>':'')+
  (importPlan.length?'<p class="import-summary">À créer : '+importPlan.filter(r=>r.action==='create').length+' · À mettre à jour : '+importPlan.filter(r=>r.action==='update').length+' · Ignorées : '+importPlan.filter(r=>r.action==='skip').length+' · Erreurs : '+errors.length+'</p>'+
   '<div class="tablewrap"><table><thead><tr><th>Ligne</th><th>Référence</th><th>Désignation</th><th>Traitement</th></tr></thead><tbody>'+
   importPlan.slice(0,10).map(r=>'<tr><td>'+r.line+'</td><td>'+esc(r.ref)+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.action)+(r.issue?' — '+esc(r.issue):'')+'</td></tr>').join('')+
   '</tbody></table></div><button class="primary" data-action="import-confirm" '+(valid.length?'':'disabled')+'>Importer '+valid.length+' ligne(s) dans la démo</button>':'')+
  '<p class="sub">Les erreurs sont exclues de l’import. Les modifications ne sont jamais envoyées à SpeedArti.</p></section>';
}
function productTable(){
 const matches=active().filter(p=>(p.ref+' '+p.name+' '+p.category).toLowerCase().includes(search.toLowerCase())&&(stockFilter==='all'||status(p)===stockFilter));
 return '<div class="title"><div><h1>Mes produits</h1><p>Modifiez les prix, mettez à jour le stock ou archivez vos références.</p></div><div class="import-header-actions"><button class="ghost" data-action="import-toggle">⇧ Importer Excel / CSV</button><button class="primary" data-action="new-product">＋ Nouveau produit</button></div></div>'+
 (importOpen?importPanelHtml():'')+
 '<div class="panel"><div class="toolbar"><input id="search" value="'+esc(search)+'" placeholder="Rechercher un produit…"><button class="ghost" data-action="search">Rechercher</button><select id="stock-filter"><option value="all">Tous les stocks</option>'+Object.keys(names).map(k=>'<option value="'+k+'" '+(stockFilter===k?'selected':'')+'>'+names[k]+'</option>').join('')+'</select><button data-action="bulk-discount" '+(selected.size?'':'disabled')+'>% Remise ('+selected.size+')</button><button data-action="bulk-archive" '+(selected.size?'':'disabled')+'>Archiver</button></div>'+
 '<div class="tablewrap"><table><thead><tr><th>Choix</th><th>Produit / référence</th><th>Prix HT</th><th>Stock</th><th>Disponibilité</th><th>Actions</th></tr></thead><tbody>'+
 matches.map(p=>'<tr><td><input type="checkbox" data-action="select" data-id="'+p.id+'" '+(selected.has(p.id)?'checked':'')+' aria-label="Sélectionner '+esc(p.ref)+'"></td><td><div class="product-ident">'+(p.photo?'<img class="product-thumb" src="'+esc(p.photo.url)+'" alt="Photo produit">':'<span class="product-thumb product-empty">▣</span>')+'<div><b>'+esc(p.name)+'</b><small>'+esc(p.ref)+' · '+esc(p.category)+' · '+esc(p.brand)+'</small>'+(p.documents.length?'<small>📎 '+p.documents.length+' PDF</small>':'')+'</div></div></td><td><input class="price" data-action="price" data-id="'+p.id+'" value="'+(p.price/100).toFixed(2).replace('.',',')+'" aria-label="Prix '+esc(p.ref)+'"> €</td><td>'+(p.mode==='quantity'?'<div class="step"><button data-action="minus" data-id="'+p.id+'">−</button><b>'+p.qty+'</b><button data-action="plus" data-id="'+p.id+'">＋</button></div>':'<span class="sub">Par statut</span>')+'</td><td><select data-action="status" data-id="'+p.id+'" class="status '+status(p)+'">'+Object.keys(names).map(s=>'<option value="'+s+'" '+(status(p)===s?'selected':'')+'>'+names[s]+'</option>').join('')+'</select></td><td><div class="actions-row"><button class="ghost" data-action="edit-product" data-id="'+p.id+'">Modifier</button><button class="ghost" data-action="mode" data-id="'+p.id+'">Mode '+(p.mode==='quantity'?'statut':'quantité')+'</button><button class="ghost" data-action="archive" data-id="'+p.id+'">Archiver</button></div></td></tr>').join('')+
 (!matches.length?'<tr><td colspan="6">Aucun produit correspondant.</td></tr>':'')+'</tbody></table></div><p class="note">Données fictives en mémoire, effacées au rechargement. La disponibilité fournisseur n’est jamais ajoutée au stock artisan.</p></div>';
}
function clients(){
 return '<div class="title"><div><h1>Clients professionnels</h1><p>Identifiez les entreprises et associez leurs codes commerciaux.</p></div><button class="primary" data-action="new-client">＋ Nouvelle entreprise</button></div><div class="panel tablewrap"><table><thead><tr><th>Entreprise</th><th>Code client</th><th>E-mail professionnel</th><th>Rattachement</th><th>Actions</th></tr></thead><tbody>'+
 companies.map(c=>'<tr><td><b>'+esc(c.name)+'</b><small>'+esc(c.siret||'SIRET non renseigné')+'</small></td><td><b>'+esc(c.code)+'</b></td><td>'+esc(c.email)+'</td><td><span class="status unknown">NON BRANCHÉ</span></td><td><button class="ghost" data-action="edit-client" data-id="'+c.id+'">Modifier</button></td></tr>').join('')+'</tbody></table></div><p class="note">Le fournisseur n’accède jamais aux noms ou adresses des clients finaux des artisans. Association SpeedArti uniquement après validation.</p>';
}
function connections(){
  return '<div class="title"><div><h1>Connexions à SpeedArti</h1><p>Rattachement des artisans par validation des deux parties, jamais automatiquement par e-mail ou code client.</p></div></div>'+
  '<div class="panel"><h2>Demande de liaison</h2><p class="sub">Ce test génère uniquement une demande fictive non approuvée. Aucune synchronisation réelle.</p><div class="toolbar"><select id="link-company"><option value="">Choisir une entreprise cliente</option>'+companies.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+' — '+esc(c.code)+'</option>').join('')+'</select><button class="primary" data-action="new-link">Préparer la demande (démo)</button></div></div>'+
  '<div class="panel"><h2>Demandes</h2>'+pendingLinks.map(l=>'<div class="line"><b>'+esc(l.name)+' — '+esc(l.code)+'</b><span class="status unknown">'+(l.revoked?'Révoquée':'En attente de validation artisan')+'</span>'+(l.revoked?'':'<button class="ghost" data-action="revoke-link" data-id="'+esc(l.id)+'">Révoquer</button>')+'</div>').join('')+(pendingLinks.length?'':'<p class="sub">Aucune demande. Connexion SpeedArti : NON BRANCHÉE.</p>')+'</div>';
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
function documents(){
 const all=products.flatMap(p=>(p.documents||[]).map(doc=>({product:p,doc})));
 const filtered=all.filter(x=>(x.doc.name+' '+x.product.name+' '+x.product.ref).toLowerCase().includes(documentSearch.toLowerCase()));
 return '<div class="title"><div><h1>Bibliothèque de documents</h1><p>Chaque PDF reste associé à un produit, y compris si le produit est archivé.</p></div><button class="primary" data-page="Produits">Ajouter depuis un produit</button></div>'+
 '<div class="panel"><div class="toolbar"><input id="document-search" value="'+esc(documentSearch)+'" placeholder="Rechercher un produit, une référence ou un fichier…"><button class="ghost" data-action="document-search">Rechercher</button></div><div class="tablewrap"><table><thead><tr><th>Document PDF</th><th>Produit associé</th><th>Type</th><th>Action</th></tr></thead><tbody>'+
 filtered.map(({product:p,doc:d})=>'<tr><td><a href="'+esc(d.url)+'" target="_blank" rel="noopener" download="'+esc(d.name)+'">📄 '+esc(d.name)+'</a></td><td><b>'+esc(p.name)+'</b><small>'+esc(p.ref)+(p.archived?' · Archivé':'')+'</small></td><td>Fiche technique</td><td><button class="ghost" data-action="edit-product" data-id="'+p.id+'" '+(p.archived?'disabled':'')+'>Fiche produit</button></td></tr>').join('')+(!filtered.length?'<tr><td colspan="4">Aucun document. Ouvrez une fiche produit pour joindre des PDF.</td></tr>':'')+'</tbody></table></div><p class="note">Documents fictifs conservés uniquement pendant la session. Stockage serveur : NON BRANCHÉ.</p></div>';
}
function settings(){return '<div class="title"><div><h1>Paramètres fournisseur</h1><p>Identité professionnelle et dépôt principal.</p></div></div><div class="panel fields"><label>Raison sociale<input disabled value="'+esc(supplier.name)+'"></label><label>SIRET<input disabled value="'+esc(supplier.siret)+'"></label><label>E-mail<input disabled value="'+esc(supplier.email)+'"></label><label>Dépot<input disabled value="DEPOT-01"></label><p class="note">Authentification fournisseur et modifications des paramètres : NON BRANCHÉES.</p></div>';}
function agencyStock(p,branch){
 if(branch==='DEPOT-01'&&!branchStocks.has(p.id+'@'+branch))return {quantity:p.mode==='quantity'?p.qty:null,status:status(p),updatedAt:p.updated};
 return branchStocks.get(p.id+'@'+branch)||{quantity:null,status:'unknown',updatedAt:null};
}
function stockOnlyPreview(table){
 const header=(table[0]||[]).map(x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim());
 const refIndex=header.findIndex(x=>['reference','ref','reference fournisseur','sku','code produit','code article'].includes(x));
 const qtyIndex=header.findIndex(x=>['stock','stock disponible','quantite','qte','quantity','qty'].includes(x));
 if(refIndex<0||qtyIndex<0)throw Error('Colonnes Référence et Stock obligatoires pour cette mise à jour');
 const known=new Map(active().map(p=>[p.ref.toUpperCase(),p])),seen=new Set();
 return table.slice(1).map((arr,i)=>{
  const reference=String(arr[refIndex]||'').trim().toUpperCase();
  const raw=String(arr[qtyIndex]??'').trim();
  const row={line:i+2,reference,quantity:null,action:'error',issue:''};
  if(!reference)row.issue='Référence manquante';
  else if(seen.has(reference))row.issue='Référence répétée dans le fichier';
  else{
   seen.add(reference);
   if(!raw){row.action='skip';row.issue='Stock non indiqué : inchangé';}
   else if(!/^\d+$/.test(raw)){row.issue='Quantité invalide';}
   else if(!known.has(reference)){row.action='skip';row.issue='Produit inconnu ou archivé';}
   else{row.action='update';row.quantity=Number(raw);}
  }
  return row;
 });
}
function stockRefreshPanelHtml(){
 const modes=[['manual','Manuellement'],['hourly','Toutes les heures'],['half_day','Toutes les 12 heures'],['daily','Tous les jours'],['weekly','Chaque semaine'],['monthly','Chaque mois']];
 const sources=[['manual_upload','Fichier sur cet appareil (manuel uniquement)'],['hosted_xlsx','Fichier Excel hébergé (connexion future)'],['hosted_csv','Fichier CSV hébergé (connexion future)'],['erp_api','API logiciel fournisseur (connexion future)'],['sftp','Export SFTP (connexion future)']];
 const valid=stockOnlyRows.filter(r=>r.action==='update').length;
 return '<section class="panel stock-refresh-demo"><h2>Actualiser les stocks par fichier</h2>'+
  '<p class="sub">Import Excel / CSV pour modifier uniquement les quantités de '+esc(demoAgency)+'. Les prix et désignations restent inchangés.</p>'+
  '<div class="toolbar"><input id="stock-refresh-file" type="file" accept=".xlsx,.csv,.tsv,.txt" aria-label="Fichier Excel CSV de stocks">'+
  '<button class="ghost" data-action="stock-refresh-preview" '+(stockOnlyRows.length?'':'disabled')+'>Contrôler le fichier</button></div>'+
  (stockOnlyNotice?'<p class="import-message" role="status">'+esc(stockOnlyNotice)+'</p>':'')+
  (stockOnlyRows.length?'<p class="import-summary">'+valid+' stock(s) à modifier — '+stockOnlyRows.filter(r=>r.action==='error').length+' erreurs — '+stockOnlyRows.filter(r=>r.action==='skip').length+' ignorés</p>'+
   '<div class="tablewrap"><table><thead><tr><th>Référence</th><th>Quantité</th><th>Résultat</th></tr></thead><tbody>'+
   stockOnlyRows.slice(0,10).map(r=>'<tr><td>'+esc(r.reference)+'</td><td>'+(r.quantity===null?'—':r.quantity)+'</td><td>'+esc(r.issue||r.action)+'</td></tr>').join('')+'</tbody></table></div>'+
   '<button class="primary" data-action="stock-refresh-apply" '+(valid?'':'disabled')+'>Mettre à jour '+valid+' stock(s) maintenant</button>':'')+
  '<h2 class="stock-plan-heading">Programmer les mises à jour</h2><p class="sub">Un fichier sur le PC ne se met pas à jour tout seul. Une programmation réelle exige un export ou fichier distant sécurisé, connecté par Anne-Sophie.</p>'+
  '<div class="import-controls"><label>Source<select id="stock-refresh-source">'+sources.map(([value,label])=>'<option value="'+value+'" '+(value===stockRefreshPlan.source?'selected':'')+'>'+label+'</option>').join('')+'</select></label>'+
  '<label>Fréquence<select id="stock-refresh-cadence">'+modes.map(([value,label])=>'<option value="'+value+'" '+(value===stockRefreshPlan.cadence?'selected':'')+' '+(stockRefreshPlan.source==='manual_upload'&&value!=='manual'?'disabled':'')+'>'+label+'</option>').join('')+'</select></label></div>'+
  '<button class="ghost" data-action="stock-refresh-save">Préparer cette programmation</button>'+
  (stockRefreshPlan.saved?'<p class="import-message">Configuration enregistrée uniquement en démo. <strong>Aucune exécution automatique active.</strong></p>':'')+'</section>';
}
function agencyScreen(){
 return '<div class="title"><div><h1>Stocks par agence</h1><p>Stocks distincts par dépôt et mises à jour fictives.</p></div><span class="status unknown">NON BRANCHÉ</span></div>'+
 '<div class="panel"><h2>Agence</h2><div class="toolbar"><select id="agency-select"><option value="DEPOT-01" '+(demoAgency==='DEPOT-01'?'selected':'')+'>Dépôt principal</option><option value="DAX" '+(demoAgency==='DAX'?'selected':'')+'>Agence Dax</option><option value="MONTAUBAN" '+(demoAgency==='MONTAUBAN'?'selected':'')+'>Agence Montauban</option></select></div><p class="sub">Un dépôt sans stock transmis indique « Non communiqué », pas « Rupture ».</p></div>'+
 stockRefreshPanelHtml()+
 '<div class="panel tablewrap"><table><thead><tr><th>Produit</th><th>Dépôt</th><th>Quantité</th><th>Disponibilité</th><th>Modification</th></tr></thead><tbody>'+
 active().map(p=>{const v=agencyStock(p,demoAgency);return '<tr><td>'+esc(p.ref)+'<small class="sub">'+esc(p.name)+'</small></td><td>'+esc(demoAgency)+'</td><td>'+(v.quantity===null?'Non communiquée':v.quantity)+'</td><td><span class="status '+esc(v.status)+'">'+esc(names[v.status])+'</span></td><td><button data-action="agency-adjust" data-id="'+esc(p.id)+'" data-change="-1" '+(v.quantity===null||v.quantity<=0?'disabled':'')+'>−1</button> <button data-action="agency-adjust" data-id="'+esc(p.id)+'" data-change="1">+1</button></td></tr>';}).join('')+'</tbody></table></div>';
}
function syncScreen(){
 return '<div class="title"><div><h1>Synchronisations fournisseurs</h1><p>Simulation de l’envoi des changements vers le connecteur SpeedArti existant.</p></div><span class="status unknown">SIMULATION — NON BRANCHÉ</span></div>'+
 '<div class="panel"><h2>Préparer un transfert fictif</h2><p class="sub">Aucun compte authentifié, aucune connexion ni API activée.</p><div class="toolbar"><button class="primary" data-action="sync-preview">Simuler la synchronisation</button><button data-action="sync-reset">Réinitialiser la simulation</button></div></div>'+
 '<div class="panel"><h2>Historique local</h2>'+syncHistory.map(x=>'<div class="line"><div><b>'+esc(x.at)+'</b><small class="sub">'+esc(x.mode)+'</small></div><span>'+x.changed+' modification(s), '+x.batches+' lot(s)</span></div>').join('')+(syncHistory.length?'':'<p class="sub">Aucune synchronisation simulée.</p>')+'</div>';
}
const views={'Dashboard':dashboard,'Produits':productTable,'Clients professionnels':clients,'Connexions SpeedArti':connections,'Synchronisations':syncScreen,'Stocks par agence':agencyScreen,'Remises':rebates,'Statistiques':stats,'Documents':documents,'Archives':archive,'Paramètres':settings};
function formField(label,name,value='',required=false){return '<label>'+esc(label)+'<input name="'+esc(name)+'" value="'+esc(value)+'" '+(required?'required':'')+'></label>';}
function modalHTML(){
 if(!popup)return '';
 const kind=popup.kind,item=popup.id?(kind==='product'?productById(popup.id):companies.find(c=>c.id===popup.id)):null;
 let fields='';
 if(kind==='product'){
   const p=item||{ref:'',name:'',category:'',brand:'',unit:'unite',price:0,qty:0,photo:null,documents:[]};
   const brands=[...new Set(products.map(x=>x.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
   const trade=tradeForCategory(p.category),custom=Boolean(p.category&&!categoryValuesForTrade(trade).includes(p.category));
   const customValue=custom?(trade==='__other__'?p.category:p.category.slice(trade.length+3)):'';
   fields='<label>Référence *<span class="public-ref-input"><input name="ref" aria-label="Référence produit" required value="'+esc(p.ref)+'" placeholder="Manuelle ou automatique">'+(item?'':'<button type="button" data-action="generate-ref">Générer</button>')+'</span></label>'+
   '<label class="form-wide">Désignation *<textarea aria-label="Désignation" name="name" rows="4" maxlength="500" placeholder="Désignation complète du produit, dimensions, caractéristiques…" required>'+esc(p.name)+'</textarea></label>'+
   '<label>Métier / famille *<select name="trade" id="trade-select" required><option value="">Choisir un métier</option><option value="__legacy__" '+(trade==='__legacy__'?'selected':'')+'>Catégories existantes</option>'+CATALOGUE_METIERS.map(g=>'<option value="'+esc(g.trade)+'" '+(trade===g.trade?'selected':'')+'>'+esc(g.trade)+'</option>').join('')+'<option value="__other__" '+(trade==='__other__'?'selected':'')+'>Autre métier ou catégorie</option></select></label>'+
   '<label>Catégorie *<select name="category" id="category-select" required>'+categoryOptionsHtml(trade,custom?'__custom__':p.category)+'</select></label>'+
   '<label class="form-wide" id="custom-category-field" '+(custom?'':'hidden')+'>Nouvelle catégorie *<input name="customCategory" id="custom-category" maxlength="110" placeholder="Ex. Accessoires particuliers" value="'+esc(customValue)+'" '+(custom?'required':'')+'></label>'+
   '<p class="form-wide category-note">Catégories proposées ; correspondance réelle avec SpeedArti à valider par Anne-Sophie.</p>'+
   '<label>Marque *<select id="brand-select" name="brand" required><option value="">Choisir une marque</option>'+brands.map(v=>'<option value="'+esc(v)+'" '+(p.brand===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'<option value="__new__">＋ Ajouter une marque</option></select></label>'+
   '<label id="brand-new-field" hidden>Nouvelle marque *<input id="brand-new" name="brandNew" placeholder="Nom du fabricant"></label>'+
   formField('Prix HT (€) *','price',(p.price/100).toFixed(2),true)+
   '<label>Unité SpeedArti *<select name="unit" required><option value="">Choisir une unité</option>'+SPEEDARTI_UNITS.map(v=>'<option value="'+v+'" '+(p.unit===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label>'+
   (item?'':formField('Stock initial','qty','0'))+
   '<div class="media-zone"><h3>Photo du produit</h3>'+(p.photo?'<img class="media-preview" src="'+esc(p.photo.url)+'" alt="Photo du produit">':'<p class="sub">Aucune photo pour le moment</p>')+
   '<input type="file" name="photo" id="photo-file" accept="image/jpeg,image/png,image/webp"><small>JPEG, PNG ou WebP — 5 Mo max.</small></div>'+
   '<div class="media-zone"><h3>Documents associés</h3><input type="file" name="pdfs" id="docs-file" multiple accept="application/pdf"><small>Plusieurs PDF possibles — 10 Mo max. chacun.</small>'+
   (p.documents.length?'<div class="linked-docs">'+p.documents.map(d=>'<div class="linked-doc"><a href="'+esc(d.url)+'" target="_blank" rel="noopener" download="'+esc(d.name)+'">📄 '+esc(d.name)+'</a><button type="button" data-action="remove-document" data-doc-id="'+d.id+'">Retirer</button></div>').join('')+'</div>':'<p class="sub">Les fichiers seront également visibles dans Documents.</p>')+
   '</div>';
 }else if(kind==='client'){
   const c=item||{name:'',code:'',email:'',siret:'',phone:'',address:'',zip:'',city:''};
   fields=formField('Raison sociale *','name',c.name,true)+formField('E-mail professionnel *','email',c.email,true)+formField('SIRET','siret',c.siret)+formField('Téléphone','phone',c.phone)+formField('Adresse','address',c.address)+formField('Code postal','zip',c.zip)+formField('Ville','city',c.city)+formField('Code client *','code',c.code,true);
 }else{
   fields=formField('Nom de la remise *','name','',true)+'<label>Périmètre<select name="scope"><option value="all">Tous les produits</option><option value="category">Par catégorie</option><option value="selected" '+(popup.selected?'selected':'')+'>Sélection actuelle ('+selected.size+')</option></select></label>'+
   formField('Catégorie (si applicable)','category')+'<label>Code client<select name="customer"><option value="">Tous les clients</option>'+companies.map(c=>'<option value="'+esc(c.code)+'">'+esc(c.name)+'</option>').join('')+'</select></label>'+
   '<label>Type<select name="mode"><option value="percent">Remise en %</option><option value="net">Prix net HT (€)</option></select></label>'+formField('Valeur *','value','5',true);
 }
 return '<div class="backdrop" id="backdrop"><div class="dialog '+(kind==='product'?'product-dialog':'')+'" role="dialog" aria-modal="true"><div class="dialogtop"><h2>'+esc(kind==='product'?(item?'Modifier le produit':'Nouveau produit'):kind==='client'?'Fiche entreprise':'Nouvelle remise')+'</h2><button data-action="close" aria-label="Fermer">×</button></div><form id="edit-form" class="fields">'+fields+'<div class="formfooter">'+(kind==='client'?'<button type="button" data-action="code">Générer le code</button>':'')+'<button type="button" data-action="close">Annuler</button><button class="primary" type="submit">Enregistrer</button></div></form></div></div>';
}
function render(){
 if(!demoUnlocked){
   document.getElementById('app').innerHTML='<main class="supplier-entry"><section class="supplier-entry-card"><div class="supplier-entry-logo"><span>S</span><div><b>SpeedArti</b><small>ESPACE FOURNISSEUR INDÉPENDANT</small></div></div><h1>Bienvenue dans votre espace fournisseur</h1><p>Un accès professionnel séparé de l’application SpeedArti des artisans.</p><form id="supplier-login"><label>E-mail professionnel<input type="email" name="email" autocomplete="username" required placeholder="vous@entreprise.fr"></label><label>Mot de passe<input type="password" name="password" autocomplete="current-password" required placeholder="Votre mot de passe"></label><button type="submit" class="primary">Se connecter</button></form><button class="supplier-reset" data-action="reset-account">Mot de passe oublié ?</button>'+(flash?'<div class="supplier-entry-error" role="alert">'+esc(flash)+'</div>':'')+'<div class="supplier-entry-divider">ESSAYER LA DÉMONSTRATION</div><button class="supplier-entry-demo" data-action="enter-demo">Découvrir la démo sans compte</button><p class="supplier-entry-foot">Connexion réelle : NON BRANCHÉE. Aucun identifiant n’est enregistré, aucun e-mail n’est envoyé. Catalogue fictif et données temporaires.<details class="install-help"><summary>Installer cette démo comme une application</summary><p>PC et Android : menu du navigateur → Installer. iPhone : Partager → Sur l’écran d’accueil. Cette PWA ne stocke aucune donnée métier hors ligne.</p></details></p></section></main>';
   return;
 }
 document.getElementById('app').innerHTML='<aside class="sidebar '+(navOpen?'open':'')+'"><div class="brand"><span class="s">S</span><div><b>SpeedArti</b><small>Espace fournisseur</small></div></div><div class="vendor"><b>Matériaux Démo</b><small>Fournisseur fictif · dépôt 01</small></div><nav class="nav">'+pages.map(([icon,name])=>'<button class="'+(page===name?'sel':'')+'" data-page="'+esc(name)+'"><span class="emoji">'+icon+'</span>'+name+(name==='Archives'&&products.filter(p=>p.archived).length?' ('+products.filter(p=>p.archived).length+')':'')+'</button>').join('')+'</nav><div class="bottom"><b>Mode démonstration</b><br>Aucune sauvegarde serveur.</div></aside>'+
 (navOpen?'<button class="shade" data-action="menu-close" aria-label="Fermer la navigation"></button>':'')+'<div class="right"><header class="top"><button class="menu" data-action="menu">☰</button><div><b>'+page+'</b><small>Gestion fournisseur</small></div><span class="pill">● Démo fictive</span></header><div class="demo-mode-top">Mode démo : données fictives et temporaires <button data-action="logout-demo">Quitter la démo</button></div><main class="content">'+(flash?'<div class="alert">'+esc(flash)+'<button data-action="clear">×</button></div>':'')+views[page]()+'</main></div>'+modalHTML();
}
document.addEventListener('click',function(e){
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page){page=b.dataset.page;navOpen=false;render();return;}
 const a=b.dataset.action,idv=b.dataset.id,p=productById(idv);
 if(a==='stock-refresh-preview'){
  if(!stockOnlyRows.length){stockOnlyNotice='Sélectionnez un fichier de stocks';render();return;}
  stockOnlyNotice=stockOnlyRows.filter(r=>r.action==='update').length+' stocks reconnus ; aucun changement avant confirmation.';
  render();return;
 }
 if(a==='stock-refresh-apply'){
  let done=0;
  for(const row of stockOnlyRows.filter(r=>r.action==='update')){
   const p=products.find(p=>p.ref.toUpperCase()===row.reference&&!p.archived);
   if(!p)continue;
   const q=row.quantity,state=q===0?'out_of_stock':q<=5?'low_stock':'in_stock';
   if(demoAgency==='DEPOT-01'){p.qty=q;p.mode='quantity';p.status=state;p.updated=stamp();}
   branchStocks.set(p.id+'@'+demoAgency,{quantity:q,status:state,updatedAt:stamp()});
   done++;
  }
  stockOnlyRows=[];stockOnlyNotice=done+' stock(s) actualisés en mémoire uniquement, aucun envoi vers SpeedArti.';
  render();return;
 }
 if(a==='stock-refresh-save'){
  const source=document.getElementById('stock-refresh-source').value;
  const cadence=document.getElementById('stock-refresh-cadence').value;
  if(source==='manual_upload'&&cadence!=='manual'){stockOnlyNotice='Un fichier local ne permet pas de programmer une mise à jour sans nouveau téléchargement.';render();return;}
  stockRefreshPlan={source,cadence,saved:true};
  stockOnlyNotice='Préparation enregistrée dans la démo : la synchronisation automatique est inactive.';
  render();return;
 }
 if(a==='agency-adjust'){
  const item=productById(idv),old=agencyStock(item,demoAgency),delta=Number(b.dataset.change);
  const next=Math.max(0,(old.quantity??0)+delta);
  branchStocks.set(item.id+'@'+demoAgency,{quantity:next,status:next===0?'out_of_stock':next<=5?'low_stock':'in_stock',updatedAt:stamp()});
  saveMessage('Stock fictif modifié pour '+demoAgency+'. Aucun envoi réel.');return;
 }
 if(a==='sync-preview'){
  let changed=0;const fresh={...syncSnapshots};
  for(const item of active()){
   const stock=agencyStock(item,'DEPOT-01');
   const fingerprint=JSON.stringify([item.ref,item.name,item.price,stock.quantity,stock.status,stock.updatedAt]);
   if(syncSnapshots[item.id]!==fingerprint){changed++;fresh[item.id]=fingerprint;}
  }
  const mode=Object.keys(syncSnapshots).length?'Différentiel':'Initial';
  syncSnapshots=fresh;syncHistory.unshift({at:new Date().toLocaleString('fr-FR'),mode,changed,batches:Math.ceil(changed/200)});
  saveMessage('Simulation uniquement : '+changed+' produit(s) modifié(s). Aucun envoi à SpeedArti.');return;
 }
 if(a==='sync-reset'){syncSnapshots={};syncHistory=[];saveMessage('Simulation réinitialisée.');return;}
 if(a==='new-link'){
   const select=document.getElementById('link-company'),company=companies.find(c=>c.id===select.value);
   if(!company){saveMessage('Choisir une entreprise cliente');return}
   pendingLinks.push({id:id(),companyId:company.id,name:company.name,code:company.code,revoked:false});
   saveMessage('Demande fictive en attente. Aucun artisan contacté.');return;
 }
 if(a==='revoke-link'){const link=pendingLinks.find(l=>l.id===idv);if(link)link.revoked=true;saveMessage('Liaison fictive révoquée.');return}
 if(a==='enter-demo'){demoUnlocked=true;flash='';render();return}
 if(a==='logout-demo'){demoUnlocked=false;selected.clear();navOpen=false;page='Dashboard';flash='';render();return}
 if(a==='reset-account'){saveMessage('Réinitialisation NON BRANCHÉE — aucun e-mail envoyé.');return}
 if(a==='menu'){navOpen=true;render();return}
 if(a==='menu-close'){navOpen=false;render();return}
 if(a==='clear'){flash='';render();return}
 if(a==='generate-ref'){
  const field=document.querySelector('#edit-form input[name="ref"]');
  if(field)field.value=suggestPublicReference('MAT');return;
 }
 if(a==='import-toggle'){importOpen=!importOpen;importMessage='';render();return;}
 if(a==='import-preview'){
  if(!importTable){importMessage='Choisir un fichier Excel, CSV ou TSV';render();return;}
  importOptions={
   auto:document.getElementById('import-auto').checked,
   prefix:document.getElementById('import-prefix').value.trim().toUpperCase(),
   update:document.getElementById('import-duplicate').value==='update',
   defaultCategory:document.getElementById('import-default-category').value
  };
  try{
   importPlan=window.SupplierCsvDemo.preview(importTable,products,importOptions);
   const errors=importPlan.filter(x=>x.action==='error').length;
   importMessage=importPlan.length+' lignes vérifiées. '+errors+' erreur(s). Aucun produit importé avant confirmation.';
  }catch(e){importPlan=[];importMessage=e instanceof Error?e.message:'Erreur d’import';}
  render();return;
 }
 if(a==='import-confirm'){
  let created=0,updated=0,ignored=0;
  for(const row of importPlan){
   if(row.action==='skip'||row.action==='error'){ignored++;continue;}
   const previous=products.find(p=>p.ref.toUpperCase()===row.ref);
   if(row.action==='update'){
    if(!previous||previous.archived){ignored++;continue;}
    Object.assign(previous,{name:row.name,brand:row.brand,category:row.category,price:row.price,unit:row.unit,updated:stamp()});
    if(row.stock!==null){previous.qty=row.stock;previous.mode='quantity';previous.status=row.stock===0?'out_of_stock':row.stock<=5?'low_stock':'in_stock';}
    updated++;
   }else if(row.action==='create'&&!previous){
    products.unshift({id:id(),ref:row.ref,name:row.name,brand:row.brand,category:row.category,unit:row.unit,price:row.price,
     qty:row.stock,mode:row.stock===null?'status':'quantity',status:row.stock===null?'unknown':row.stock===0?'out_of_stock':row.stock<=5?'low_stock':'in_stock',
     archived:false,updated:stamp(),photo:null,documents:[]});created++;
   }else ignored++;
  }
  importPlan=[];importTable=null;importMessage=created+' produit(s) créés, '+updated+' mis à jour, '+ignored+' ignorés — démo en mémoire uniquement.';
  flash=importMessage;render();return;
 }
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
 if(a==='document-search'){documentSearch=document.getElementById('document-search').value;render();return}
 if(a==='remove-document'){
   if(!popup||popup.kind!=='product'||!popup.id)return;
   const pr=productById(popup.id),doc=pr.documents.find(d=>d.id===b.dataset.docId);
   if(!doc)return;pr.documents=pr.documents.filter(d=>d.id!==doc.id);
   URL.revokeObjectURL(doc.url);flash='PDF retiré de la fiche produit';render();return;
 }
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
 if(el.id==='stock-refresh-source'){
  stockRefreshPlan.source=el.value;
  if(el.value==='manual_upload')stockRefreshPlan.cadence='manual';
  stockRefreshPlan.saved=false;render();return;
 }
 if(el.id==='stock-refresh-cadence'){
  stockRefreshPlan.cadence=el.value;stockRefreshPlan.saved=false;return;
 }
 if(el.id==='stock-refresh-file'){
  const file=el.files?.[0];if(!file)return;
  if(file.size<=0||file.size>10*1024*1024||!/(\.xlsx|\.csv|\.tsv|\.txt)$/i.test(file.name)){
   stockOnlyNotice='Formats de stocks acceptés : XLSX, CSV ou TSV, 10 Mo maximum.';stockOnlyRows=[];render();return;
  }
  const reading=/\.xlsx$/i.test(file.name)?
   (typeof window.readXlsxFile==='function'?window.readXlsxFile(file):Promise.reject(Error('Lecteur Excel indisponible, vérifier votre connexion et actualiser.'))):
   file.text().then(text=>window.SupplierCsvDemo.parse(text));
  Promise.resolve(reading).then(data=>{
   const table=data.map(row=>row.map(value=>value===null||value===undefined?'':String(value)));
   stockOnlyRows=stockOnlyPreview(table);
   stockOnlyNotice=file.name+' : '+stockOnlyRows.length+' lignes lues. Vérifiez avant la mise à jour.';
   render();
  }).catch(e=>{stockOnlyRows=[];stockOnlyNotice=e.message||'Lecture impossible';render();});
  return;
 }
 if(el.id==='import-file'){
  const file=el.files?.[0];
  if(!file)return;
  if(file.size<=0||file.size>10*1024*1024||!/(\.xlsx|\.csv|\.tsv|\.txt)$/i.test(file.name)){
   importMessage='Formats acceptés : Excel .xlsx, CSV ou TSV, 10 Mo maximum.';importPlan=[];render();return;
  }
  const excel=/\.xlsx$/i.test(file.name);
  const reading=excel?
   (typeof window.readXlsxFile==='function'?window.readXlsxFile(file):Promise.reject(Error('Lecteur Excel indisponible. Actualisez la page ou utilisez un CSV.'))):
   file.text().then(text=>window.SupplierCsvDemo.parse(text));
  Promise.resolve(reading).then(table=>{
   importTable=excel?table.map(row=>row.map(cell=>cell===null||cell===undefined?'':String(cell))):table;
   if(importTable.length<2)throw Error('Fichier vide ou sans produit');
   importPlan=[];importMessage=importTable.length-1+' ligne(s) chargées depuis '+file.name+'. Clique sur Vérifier le fichier.';
   render();
  }).catch(e=>{importTable=null;importPlan=[];importMessage=e instanceof Error?e.message:'Lecture impossible';render();});
  return;
 }
 if(el.id==='agency-select'){demoAgency=el.value;render();return;}
 if(el.id==='trade-select'){
   const category=document.getElementById('category-select');
   category.innerHTML=categoryOptionsHtml(el.value,el.value==='__other__'?'__custom__':'');
   category.value=el.value==='__other__'?'__custom__':'';
   document.getElementById('custom-category').value='';toggleCustomCategory();return;
 }
 if(el.id==='category-select'){toggleCustomCategory();return;}
 if(el.id==='stock-filter'){stockFilter=el.value;render();return}
 if(el.id==='brand-select'){
  const input=document.getElementById('brand-new');
  document.getElementById('brand-new-field').hidden=el.value!=='__new__';
  input.required=el.value==='__new__';return;
 }
 if(a==='select'){el.checked?selected.add(idv):selected.delete(idv);render();return}
 if(a==='status'){p.mode='status';p.qty=null;p.status=el.value;p.updated=stamp();render();return}
 if(a==='price'){const v=money(el.value);if(!Number.isSafeInteger(v)||v<0){saveMessage('Prix HT invalide');return;}p.price=v;render();return;}
});
document.addEventListener('submit',function(e){
 if(e.target.id==='supplier-login'){
   e.preventDefault();saveMessage('Connexion réelle NON BRANCHÉE — aucun compte n’a été connecté.');return;
 }
 if(e.target.id!=='edit-form')return;
 e.preventDefault();const data=Object.fromEntries(new FormData(e.target));
 const k=popup.kind;
 if(k==='product'){
   const v=money(data.price),quantity=Number(data.qty||0);
   const rawCategory=String(data.category||'');
   const category=rawCategory==='__custom__'?(String(data.trade)==='__other__'?'':String(data.trade)+' / ')+String(data.customCategory||'').trim():rawCategory;
   const brand=String(data.brand)==='__new__'?String(data.brandNew||'').trim():String(data.brand||'').trim();
   if(!brand){saveMessage('Marque obligatoire');return}
   if(!category.trim()||category.length>150){saveMessage('Choisir ou saisir une catégorie valide');return}
   if(!SPEEDARTI_UNITS.includes(data.unit)){saveMessage('Choisir une unité SpeedArti');return}
   if(!Number.isSafeInteger(v)||v<0){saveMessage('Prix HT invalide');return}
   const photo=e.target.querySelector('#photo-file').files[0]||null;
   const pdfs=[...e.target.querySelector('#docs-file').files];
   try{validateSelectedFiles(photo,pdfs)}catch(error){saveMessage(error.message);return}
   const existing=products.find(p=>p.ref.toUpperCase()===String(data.ref).trim().toUpperCase()&&p.id!==popup.id);
   if(existing){saveMessage('Référence déjà existante');return}
   if(!popup.id&&(!Number.isSafeInteger(quantity)||quantity<0)){saveMessage('Stock initial invalide');return}
   let target;
   if(popup.id){
     target=productById(popup.id);
     Object.assign(target,{ref:String(data.ref).trim().toUpperCase(),name:data.name,category,brand,price:v,unit:data.unit,updated:stamp()});
   }else{
     target={id:id(),ref:String(data.ref).trim().toUpperCase(),name:data.name,category,brand,price:v,unit:data.unit,qty:quantity,mode:'quantity',status:quantity===0?'out_of_stock':quantity<=5?'low_stock':'in_stock',updated:stamp(),archived:false,photo:null,documents:[]};
     products.unshift(target);
   }
   if(photo){
     if(target.photo)URL.revokeObjectURL(target.photo.url);
     target.photo={name:photo.name,mimeType:photo.type,sizeBytes:photo.size,url:URL.createObjectURL(photo)};
   }
   pdfs.forEach(file=>target.documents.push({id:id(),productId:target.id,name:file.name,mimeType:file.type,sizeBytes:file.size,kind:'Fiche technique',url:URL.createObjectURL(file)}));
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

/* Optional installable shell, no private authentication or sync. */
if('serviceWorker' in navigator&&location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}));
}
