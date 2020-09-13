# Adding the Progressive Web App plugin

Run the command below to install the `@vue/cli-plugin-pwa package`, which adds Progressive Web App functionality to your project.

```
vue add @vue/pwa
```

These are the files being added/updated:
```
├── package-lock.json
├── package.json
├── public
│   ├── img
│   │   └── icons
│   │       ├── android-<size>.png
│   │       └── ...
│   ├── manifest.json
│   └── robots.txt
└── src
  ├── main.js
  └── registerServiceWorker.js
```

The default behaviour creates a new generic  service worker for every build and precaches all resources in the `public` folder.

> You can use the default behaviour by setting `pwa.workboxPluginMode = 'GenerateSW'` when using `vue.config.js`.

# Testing your PWA

In order to test the service worker we need to build for production

```
npm run build
```

```
└── dist
  ├── css
  │   └── app.<version>.css
  ├── img/icons
  │   ├── android-chrome-<size>.png
  │   ├── apple-touch-<size>.png
  │   ├── favicon-<size>.css
  │   └── ...
  ├── js
  │   ├── app.<version>.png
  │   ├── chunck-<version>.png
  │   └── polyfills-<version>.css
  ├── favicon.ico
  ├── index.html
  ├── manifest.json
  ├── precache-manifest.<version>.json
  ├── robots.txt
  └── service-worker.js
```

Run local server

```
cd dist
python -m SimpleHTTPServer 8887
```

# Changes to your App

Move any app rendering to outside of `amplify-authenticator` as otherwise it won't be rendered offline.

In order for authorisation to work you need to log-in while online and go offline afterwards.

> It's not possible to use the app offline without being authorised due to security.

# Using a custom configuration

If you want to have more control over the service worker behaviour create a new `vue.config.js` file with your preferred setup.

```
module.exports = {
  pwa: {
    name: 'Chatty',
    themeColor: '#4DBA87',    // maps to theme_color in manifest.json
    msTileColor: '#000000',   // maps to background_color in manifest.json
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    }
  }
}
```

Create the file `src/service-worker.js`:

```
workbox.core.setCacheNameDetails({ prefix: 'amplify-datastore' })

workbox.core.skipWaiting()
workbox.core.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
```

You may need to add more entries to the cache for offline. You can add those like this:

```
const cacheFiles = [
  {
    "revision": "931caf57a56b47ef400c",
    "url": "/img/icons/favicon-32x32.png"
  },
]

self.__precacheManifest = cacheFiles.concat(self.__precacheManifest || [])
```