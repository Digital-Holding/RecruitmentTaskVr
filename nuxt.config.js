import webpack from 'webpack';
import fs from 'fs'
import path from 'path'

export default {
  ssr: false,
  head: {
    title: 'RecruitmentTaskVr',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{rel: 'icon', type: 'image/x-icon', href: 'favicon.ico'}]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {color: '#35495e'},
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/styles.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      'nuxt-compress',
      {
        gzip: {
          cache: true
        },
        brotli: {
          threshold: 10240
        }
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {
      config.plugins.push(new webpack.ProvidePlugin({
        THREE: 'three'
      }));
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'dev/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'dev/server.cert')),
    }
  }
};
