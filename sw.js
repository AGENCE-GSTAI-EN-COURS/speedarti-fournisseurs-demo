/* Public demo PWA: no business data is stored. */
'use strict';const CACHE='speedarti-supplier-demo-assets-v1';
const offline=new URL('./offline.html',self.registration.scope).toString();
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.add(offline)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('speedarti-supplier-demo-assets-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.cache==='no-store')return;
 const u=new URL(r.url),base=new URL(self.registration.scope).pathname;
 if(u.origin!==self.location.origin||!u.pathname.startsWith(base))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match(offline)));return;}
 if(u.pathname===base+'app.js'||u.pathname===base+'styles.css'){
  e.respondWith(fetch(r).then(async response=>{if(response.ok){const c=await caches.open(CACHE);await c.put(r,response.clone());}return response;}).catch(()=>caches.match(r)));
 }
});
