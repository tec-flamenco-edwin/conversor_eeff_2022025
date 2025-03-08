const CACHE_NAME = "convertidor-temperatura-v1";

self.addEventListener('install', event => { 
    event.waitUntil((async()=>{
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([ 
            './',
           // './index.html',
            './converter.js',
            './css/style.css'
        ]);
    })());
});

self.addEventListener('fetch',event=> {
    event.respondWith((async ()  =>{
        const cache = await caches.open(CACHE_NAME);
        const cachedRespone = await cache.match(event.request);
         
        if (cachedRespone){
            return cachedRespone;

        }else{
            try{
                const fetchResponse = await fetch(event.request);
                cache.put(event.request,fetchResponse.close());
                return fetchResponse;

            }catch(e){
                //hubo problemas  de red de datos 
            }
        }
    })());
});