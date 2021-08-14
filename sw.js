(function (navigator) {
    var
        windowAddEventListener = self.addEventListener,
        IS_ONLINE = navigator.onLine,
        CACHE_NAME = 'hris-v1',
        urlsToCache = [
            "/",
            '/idx.min.htm',
            "/main.min.js"
        ],
        eventNameInstall = "install",
        eventNameFetch = "fetch",
        eventNameActivate = "activate",
        updateOnlineStatus = event => {
            IS_ONLINE = navigator.onLine;
            console.log("event type:",event.type,"online:",IS_ONLINE);
        }
    ;
    //windowAddEventListener("online", updateOnlineStatus);
    //windowAddEventListener("offline", updateOnlineStatus);

/*     windowAddEventListener(eventNameInstall, event => {
        console.log("install","online:",IS_ONLINE);
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }));
    });
    windowAddEventListener(eventNameFetch, event => {
        console.log("fetch","online:",IS_ONLINE);
        event.respondWith(caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        }));
    }); */
    /* windowAddEventListener(eventNameActivate, event => {
        var cacheWhitelist = [CACHE_NAME];
        event.waitUntil(caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }));
    }); */
    console.log("IS_ONLINE:", IS_ONLINE)
})(navigator);