var Interactor = require('./interactor');
// An example instantiation with custom arguments
module.exports = new Interactor({
  endpoint: '/usage/interactions',
  async: true,
  debug: true
});
