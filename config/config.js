var path = require('path')

module.exports = {
  dev: {
    db: 'mongodb://localhost/observe',
    session_secret: 'thisisasecret'
  },
  test: {
    db: 'mongodb://localhost/observe_test',
    session_secret: 'thisisasecret'
  },
  production: {
    db: 'mongodb://localhost/observe',
    session_secret: 'thisisasecret'
  }
}
