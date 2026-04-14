const config = require('./config.json')

module.exports = {
  transpileDependencies: ['vue-router'],
  devServer: {
    host: config.api_url
  },
  chainWebpack: config => {
    config.resolve.alias.set(
      'vue-i18n',
      'vue-i18n/dist/vue-i18n.esm-bundler.js'
    )
  }
}
