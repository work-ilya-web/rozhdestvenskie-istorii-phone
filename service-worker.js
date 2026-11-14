'use strict';
const CACHE='christmas-stories-mobile-phone-v4-741fc69ad21043';
const HOME=new URL('./',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('christmas-stories-mobile-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
async function save(request,response){if(response.ok&&response.status===200){try{const copy=response.clone();const cache=await caches.open(CACHE);await cache.put(request,copy);const keys=await cache.keys();if(keys.length>260)for(const old of keys.slice(0,keys.length-260))if(old.url!==HOME)await cache.delete(old)}catch{}}}
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||request.headers.has('range'))return;
 event.respondWith((async()=>{
  const key=request.mode==='navigate'?HOME:request,cache=await caches.open(CACHE),cached=await cache.match(key);
  // Build-hashed images and level packs are immutable. Reopening a room is local.
  if(cached&&request.mode!=='navigate')return cached;
  const network=fetch(request).then(response=>{event.waitUntil(save(key,response));return response});
  if(request.mode==='navigate'&&cached){let timer;try{return await Promise.race([network,new Promise(resolve=>{timer=setTimeout(()=>resolve(cached),2500)})])}catch{return cached}finally{clearTimeout(timer)}}
  try{return await network}catch{return cached||Response.error()}
 })());
});
