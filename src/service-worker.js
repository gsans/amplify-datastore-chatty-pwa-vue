workbox.core.setCacheNameDetails({ prefix: 'amplify-datastore' })

workbox.core.skipWaiting()
workbox.core.clientsClaim()

const cacheFiles = [
  {
    "revision": "931caf57a56b47ef400c",
    "url": "/img/icons/android-chrome-192x192.png"
  },
  {
    "revision": "81b4ff3d9ff09591cc33",
    "url": "/img/icons/favicon-16x16.png"
  },
  {
    "revision": "29372bb30481defdc33d",
    "url": "/img/icons/favicon-32x32.png"
  },
  {
    "revision": "e653ab4d124bf16b5232",
    "url": "https://aws-amplify.github.io/images/Logos/Amplify-Logo-White.svg"
  },
  {
    "revision": "66b946627566f0b6fa10",
    "url": "service-worker.js"
  } 
]

self.__precacheManifest = cacheFiles.concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})