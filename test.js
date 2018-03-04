"use strict";

const contract = require('./core/index.js')();
let libs = require("./etc/libs");
global.observer_ethereum_address = require("./config.json").ethereum.observer.address;


async function f() {
    let event = contract.OfferIdMention();
    event.watch((err, res)=> {
        console.log(err, res);
    });
    let offers_id = await libs.to_promise(contract.getOngoingOffers, {from: global.observer_ethereum_address, gas: 3000000});
    console.log(offers_id);

}
f()