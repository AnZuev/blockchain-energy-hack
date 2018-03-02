"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 02/03/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */


const config = require("./config.json");
let to_promise = require("./etc/libs").to_promise;

const Web3 = require('web3');
let web3 = new Web3();
let node_address = `${config.ethereum.node.protocol}://${config.ethereum.node.host}:${config.ethereum.node.port}`;

web3.setProvider(new web3.providers.HttpProvider(node_address));

// TODO: insert path to contract.json
let abi = require("./core/build/contracts/CoreContract.json").abi;

let address = config.ethereum.smart_contract_address;
let contract = web3.eth.contract(abi).at(address);

contract.checkUserExistence({from: "821aEa9a577a9b44299B9c15c88cf3087F3b5544"}, (err, res) => {
    console.log(res);
});


let usualConsumption = [
    4, 4, 4, 4, 4, 4,
    5, 5, 5, 7, 7, 7,
    7, 7, 4, 5, 4, 4,
    4, 4, 3, 3, 2, 1
];




let f = async() =>{
    let result = contract.getTime.call();
    console.log(result)
    console.log(contract.getOwner())
    //let result = await contract.addNewUser.sendTransaction("consumer", usualConsumption, {from:"821aEa9a577a9b44299B9c15c88cf3087F3b5544"});
    //let result = await to_promise( {from: "821aEa9a577a9b44299B9c15c88cf3087F3b5544"});
    //console.log("User has been added to smart contract!");
    //console.log(result);
};

f();