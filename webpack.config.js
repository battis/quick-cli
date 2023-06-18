const config = require('@battis/webpack/ts/node-module');

module.exports = config({
  root: __dirname,
  bundle: 'cli',
  libraryName: '@battis/cli'
});
