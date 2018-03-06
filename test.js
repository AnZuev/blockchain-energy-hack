"use strict";

const contract = require('./core/index.js')();
let libs = require("./etc/libs");
global.observer_ethereum_address = require("./config.json").ethereum.observer.address;


async function f() {
    let address = '0xb00e6246ab1e5d00e404bcde21c941757e9b007b';
    let time_cons1 = await libs.to_promise(contract.getConsumptionPerUser, 80, address, {from: address, gas: 3000000});
    let time_cons2 = await libs.to_promise(contract.getConsumptionPerUser, 81, address, {from: address, gas: 3000000});
    let usual_cons1 = await libs.to_promise(contract.getUserUsualCons, address, 80, {from: address, gas: 3000000});
    let usual_cons2 = await libs.to_promise(contract.getUserUsualCons, address, 81, {from: address, gas: 3000000});


    ////let offer_info = await libs.to_promise(contract.getOfferInfo, 1,  {from: global.observer_ethereum_address, gas: 3000000});
    console.log(time_cons1, usual_cons1);
    console.log(time_cons2, usual_cons2);

}
f();