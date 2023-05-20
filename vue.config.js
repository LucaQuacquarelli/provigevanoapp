const config = require('./config.json')

module.exports = {
  devServer: {
    host: config.api_url
  }
}
