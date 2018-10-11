const SethProvider = require('truffle-sawtooth-seth-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      provider: new SethProvider('http://127.0.0.1:3030'),
      network_id: "*" // Match any network id
    }
  }
};
