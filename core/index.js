"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 26/02/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */


let contract;
module.exports = () => {
    if(contract){
        return contract
    }else{
        console.log("Core module is being started...");
        const config = require("../config.json");
        const Web3 = require('web3');
        let web3 = new Web3();
        let node_address = `${config.ethereum.node.protocol}://${config.ethereum.node.host}:${config.ethereum.node.port}`;

        web3.setProvider(new web3.providers.HttpProvider(node_address));

        // TODO: insert path to contract.json
        let abi = require("./build/contracts/CoreContract.json").abi;

        let address = config.ethereum.smart_contract_address;
        contract = web3.eth.contract(abi).at(address);

        console.log("Core module has been started");
        return contract
    }
};