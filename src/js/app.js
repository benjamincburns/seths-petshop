const SethProvider = require('truffle-sawtooth-seth-provider');
const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const adoptionArtifact = require('../../build/contracts/Adoption.json');

let web3 = null;

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    App.initWeb3();
    App.initContract();
    App.bindEvents();
  },

  initWeb3: function() {
    // If no injected web3 instance is detected, fall back to Ganache
    if (web3 && web3.currentProvider.stop) {
      web3.currentProvider.stop();
      web3.setProvider(null);
      if (App.contracts && App.contracts.Adoption) {
        App.contracts.Adoption.setProvider(null);
      }
    }

    App.web3Provider = new SethProvider(`http://${document.location.hostname}:3030`);
    web3 = new Web3(App.web3Provider);

    web3.currentProvider.on('block', (block) => {
      console.log('block', block.number);
      App.markAdopted();
    });
  },

  initContract: function() {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var AdoptionArtifact = adoptionArtifact;
    App.contracts.Adoption = TruffleContract(AdoptionArtifact);

    // Set the provider for our contract
    App.contracts.Adoption.setProvider(App.web3Provider);
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: async function() {
    console.log('markAdopted');
    let adoptionInstance = await App.contracts.Adoption.deployed();

    let adopters = await adoptionInstance.getAdopters.call();
    for (i = 0; i < adopters.length; i++) {
      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      }
    }
  },

  handleAdopt: async function(event) {
    //try {
      event.preventDefault();

      let petId = parseInt($(event.target).data('id'));
      let accounts = await web3.eth.getAccounts();
      let account = accounts[0];

      let adoptionInstance = await App.contracts.Adoption.deployed();

      // Execute adopt as a transaction by sending account
      let receipt = await adoptionInstance.adopt(petId, { from : account });

    //} catch (err) {
    //console.log(err.message);
    //}
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
