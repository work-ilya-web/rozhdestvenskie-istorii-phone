'use strict';
const CACHE='christmas-stories-mobile-phone-8a67121a0f28';
const HOME=new URL('./',self.registration.scope).href;
const SHELL=['./','./app.webmanifest','./assets/app-icons/icon-192.png','./assets/app-icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(SHELL);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('christmas-stories-mobile-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||request.headers.has('range'))return;
 event.respondWith((async()=>{
  const key=request.mode==='navigate'?HOME:request;
  try{
   const response=await fetch(request);
   if(response.ok&&response.status===200){
    const copy=response.clone();event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.put(key,copy);const keys=await cache.keys();if(keys.length>180)for(const old of keys.slice(0,keys.length-180))if(old.url!==HOME)await cache.delete(old)}catch{}})());
   }
   return response;
  }catch{
   const cached=await caches.match(key);return cached||Response.error();
  }
 })());
});
