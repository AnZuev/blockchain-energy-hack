"use strict";

const contract = require('./core/index.js')();
let libs = require("./etc/libs");
global.observer_ethereum_address = require("./config.json").ethereum.observer.address;


async function f() {
    let address = '0x6800cb2d1ef216993a3b87c69b536b32d1a0d64a';
    let time_cons = await libs.to_promise(contract.getUserUsualCons, '0x6800cb2d1ef216993a3b87c69b536b32d1a0d64a', 40, {from: address, gas: 3000000});
    ////let offer_info = await libs.to_promise(contract.getOfferInfo, 1,  {from: global.observer_ethereum_address, gas: 3000000});
    console.log(time_cons);

}
f();