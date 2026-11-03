/* Public supplier demo only: text CSV/TSV import, no network or storage. 
 * Full .xlsx import and configurable mapping exist only in the private React PWA.
 */
(function(){
 'use strict';
 const clean=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 function separator(text){
  const head=text.replace(/^\uFEFF/,'').split(/\r?\n/)[0],kinds=[';','\t',','];
  return kinds.reduce((best,curr)=>head.split(curr).length>head.split(best).length?curr:best,';');
 }
 function parse(text){
  const delim=separator(text),rows=[],fields=[];let buffer='',quoted=false;
  for(let i=0;i<text.length;i++){
   const c=text[i];if(c==='"'){
    if(quoted&&text[i+1]==='"'){buffer+='"';i++;}
    else if(!quoted&&!buffer)quoted=true;
    else if(quoted)quoted=false;
    else buffer+=c;
   }else if(!quoted&&c===delim){fields.push(buffer);buffer='';}
   else if(!quoted&&(c==='\n'||c==='\r')){
    fields.push(buffer);buffer='';
    if(fields.some(v=>v.trim()))rows.push([...fields]);fields.length=0;
    if(c==='\r'&&text[i+1]==='\n')i++;
    if(rows.length>20001)throw Error('Limite de 20 000 lignes');
   }else buffer+=c;
  }
  if(quoted)throw Error('CSV incorrect : guillemet non fermé');
  fields.push(buffer);if(fields.some(v=>v.trim()))rows.push([...fields]);
  if(rows.length>20001)throw Error('Limite de 20 000 lignes');
  if(!rows.length)throw Error('Fichier vide');
  rows[0][0]=rows[0][0].replace(/^\uFEFF/,'');
  return rows;
 }
 function headerIndex(headers,aliases){return headers.findIndex(h=>aliases.includes(clean(h)));}
 function price(raw){
  let v=String(raw||'').replace(/[\s\u00a0€]/g,'');
  if(v.includes(',')&&v.includes('.'))v=v.lastIndexOf(',')>v.lastIndexOf('.')?v.replace(/\./g,'').replace(',','.'):v.replace(/,/g,'');
  else v=v.replace(',','.');
  if(!/^\d+(?:\.\d{1,2})?$/.test(v))throw Error('Prix HT non valide');
  return Math.round(Number(v)*100);
 }
 function preview(table,existing,options){
  const headers=table[0]||[];
  const indexes={
   ref:headerIndex(headers,['reference','ref','reference fournisseur','ref fournisseur','sku','code article','code produit']),
   name:headerIndex(headers,['designation','libelle','produit','nom produit','product name','name','article']),
   price:headerIndex(headers,['prix ht','prix','tarif ht','prix unitaire ht','price','pv ht','tarif']),
   category:headerIndex(headers,['categorie','famille','category']),
   brand:headerIndex(headers,['marque','fabricant','brand']),
   stock:headerIndex(headers,['stock','quantite','qte','quantity','qty'])
  };
  if(indexes.name<0||indexes.price<0)throw Error('Colonnes Désignation et Prix HT nécessaires');
  const known=new Map(existing.map(p=>[p.ref.toUpperCase(),p]));
  const reserved=new Set([...known.keys(),...table.slice(1).map(row=>indexes.ref<0?'':String(row[indexes.ref]||'').trim().toUpperCase()).filter(Boolean)]);
  const prefix=String(options.prefix||'MAT').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(prefix.length<2||prefix.length>8)throw Error('Préfixe de 2 à 8 caractères nécessaire');
  let seq=1;
  for(const code of reserved){const hit=code.match(new RegExp('^'+prefix+'-([0-9]{1,8})$'));if(hit)seq=Math.max(seq,Number(hit[1])+1);}
  const rows=[];
  for(let i=1;i<table.length;i++){
   const data=table[i],cell=k=>indexes[k]<0?'':String(data[indexes[k]]||'').trim();
   const row={line:i+1,ref:cell('ref').toUpperCase(),name:cell('name'),brand:cell('brand')||'Démo',category:cell('category')||'Fournitures et consommables / Fournitures diverses',
    unit:'unite',stock:null,price:0,action:'create',issue:''};
   try{
    if(!row.ref){
     if(!options.auto)throw Error('Référence manquante');
     row.ref=prefix+'-'+String(seq++).padStart(6,'0');
     while(reserved.has(row.ref))row.ref=prefix+'-'+String(seq++).padStart(6,'0');
     reserved.add(row.ref);
    }
    if(!/^[A-Z0-9][A-Z0-9._/-]{0,79}$/.test(row.ref))throw Error('Référence invalide');
    if(!row.name)throw Error('Désignation manquante');
    row.price=price(cell('price'));
    const stock=cell('stock');
    if(stock){if(!/^\d+$/.test(stock))throw Error('Stock invalide');row.stock=Number(stock);}
    const prior=known.get(row.ref);
    if(prior){
     if(prior==='pending'){row.action='error';row.issue='Référence répétée dans le fichier';}
     else if(options.update){row.action='update';}
     else{row.action='skip';row.issue='Référence existante — ignorée';}
    }else{known.set(row.ref,'pending');row.action='create';}
   }catch(e){row.action='error';row.issue=e.message;}
   rows.push(row);
  }
  return rows;
 }
 window.SupplierCsvDemo={parse,preview};
})();
