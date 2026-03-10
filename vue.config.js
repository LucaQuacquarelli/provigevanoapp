const config = require('./config.json')

module.exports = {
  transpileDependencies: ['vue-router'],
  devServer: {
    host: config.api_url
  }
}
