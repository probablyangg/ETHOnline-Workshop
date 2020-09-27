var Token = artifacts.require("./TutorialToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
