const CACHE='mi-diaria-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const keep=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
// Archivos de la app: primero internet (así siempre ves la última versión) y, sin conexión, la copia guardada.
// Módulo externo de Excel: primero la copia guardada.
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin===location.origin){
    e.respondWith(fetch(r).then(res=>keep(r,res)).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>keep(r,res))));
  }
});
