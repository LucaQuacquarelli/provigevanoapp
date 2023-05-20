const app = require('./app')
const config = require('../config.json')

const http = require('http')
http.createServer({}, app).listen(config.api_port, () =>
  console.log(`ProApp API server listening on port ${config.api_port}!`)
)
