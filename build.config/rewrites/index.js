const devConfig = require('./development');
const proConfig = require('./production');
const testConfig = require('./test');
const { NEXT_PUBLIC_APP_ENV } = process.env;

const config = {
  development: devConfig,
  production: proConfig,
  test: testConfig,
};

module.exports = config[NEXT_PUBLIC_APP_ENV];
