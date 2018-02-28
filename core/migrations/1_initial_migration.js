var Migrations = artifacts.require("./contracts/Migrations.sol");
var CoreContract = artifacts.require("./contracts/CoreContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(CoreContract);
};
