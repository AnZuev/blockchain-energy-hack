"use strict";

const contract = require('./core/index.js')();
let libs = require("./etc/libs");
global.observer_ethereum_address = require("./config.json").ethereum.observer.address;


async function f() {
    //let offer_id = await libs.to_promise(contract.getAvailableOffers, 0, {from: global.observer_ethereum_address, gas: 3000000});
    //let offer = await libs.to_promise(contract.getOfferInfo, offer_id, {from: global.observer_ethereum_address, gas: 3000000});

    let event = contract.OfferCreated();
    event.watch((err, res)=> {
        console.log(err, res);
    });

    //let result = await libs.to_promise(contract.getTime, {from: global.observer_ethereum_address});
    //console.log(offer)
}
f();