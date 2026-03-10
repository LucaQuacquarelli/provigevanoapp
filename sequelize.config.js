const config = require('./config.json');

module.exports = {
  development: config.dbms,
  test: config.dbms,
  production: config.dbms
};
