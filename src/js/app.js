App = {
  web3Provider: null,
  contracts: {},
  web3js: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window['ethereum']
    }
    App.web3js = new Web3 (App.web3Provider)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('TutorialToken.json', function(data) {
      var TutorialTokenArtifact = data;
      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);
      App.contracts.TutorialToken.setProvider(App.web3Provider);
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tutorialTokenInstance;

    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');
    var tutorialTokenInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
