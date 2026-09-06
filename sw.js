
/* Max Love Fitness service worker. Network first for pages so an update always wins;
   cache first for the static assets so the rest timer and the calculators work at the bar with no signal. */
var V = "mlf-83989c0b";
var CORE = ["index.html","start.html","plan.html","tools.html","about.html","apply.html","links.html","site.css?v=83989c0b","hero.jpg","favicon.svg","apple-touch-icon.jpg"];
self.addEventListener("install", function(e){ self.skipWaiting(); e.waitUntil(caches.open(V).then(function(c){ return Promise.allSettled(CORE.map(function(u){ return c.add(u); })); })); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch", function(e){
  var r = e.request; if (r.method !== "GET") return;
  var u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === "navigate" || (r.headers.get("accept")||"").indexOf("text/html") > -1){
    e.respondWith(fetch(r).then(function(res){ var copy = res.clone(); caches.open(V).then(function(c){ c.put(r, copy); }); return res; }).catch(function(){ return caches.match(r, {ignoreSearch:true}).then(function(m){ return m || caches.match("index.html"); }); }));
    return;
  }
  e.respondWith(caches.match(r, {ignoreSearch:true}).then(function(m){ return m || fetch(r).then(function(res){ var copy = res.clone(); caches.open(V).then(function(c){ c.put(r, copy); }); return res; }); }));
});
