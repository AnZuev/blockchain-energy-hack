let Migrations = artifacts.require("./contracts/Migrations.sol");
let CoreContract = artifacts.require("./contracts/CoreContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(CoreContract);
};
