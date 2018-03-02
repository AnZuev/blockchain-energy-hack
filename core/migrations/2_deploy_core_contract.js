let CoreContract = artifacts.require("./contracts/CoreContract.sol");

module.exports = function(deployer) {
  deployer.deploy(CoreContract);
};
