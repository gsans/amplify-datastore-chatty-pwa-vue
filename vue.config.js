// const { InjectManifest } = require('workbox-webpack-plugin')

// //optional, but InjectManifest didn't respect the {mode: 'development'} config
// process.env.NODE_ENV = 'development'

const manifest = require('./public/manifest.json')

module.exports = {
  // configureWebpack: {
  //   plugins: [
  //     new InjectManifest({
  //       swSrc: './src/registerServiceWorker.js',
  //       swDest: 'service-worker.js'
  //     })
  //   ]
  // },
  pwa: {
    name: manifest.short_name,
    themeColor: manifest.theme_color,
    msTileColor: manifest.background_color,
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    }
  }
}