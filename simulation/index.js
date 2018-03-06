"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 05/03/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */
let to_promise = require("../etc/libs").to_promise;

// initialising connection to the nodes
const config = require("../config.json");
const Web3 = require('web3');
let web3 = new Web3();
let node_address = `${config.ethereum.node.protocol}://${config.ethereum.node.host}:${config.ethereum.node.port}`;
const contract = require('../core/index.js')();

// [0-9] - reserved for users
// [10-69] - for flats
// [70 - 99] - for factories
let accounts = require("./accounts.json");

// can't be more than 60
const NUMBER_OF_FLATS = 50;

// can't be more than 30
const NUMBER_OF_FACTORIES = 5;

// starts from 12:00 a.m.
const FLAT_CONSUMPTION = [
    3000, 3000, 3000, 3000, 3000, 3000,
    4000, 5000, 10000, 8000, 8000, 7000,
    7000, 7000, 7000, 8000, 8000, 10000,
    9000, 8000, 6000, 6000, 4000, 3000,
];

const FACTORY_CONSUMPTION = [
    70000, 70000, 70000, 80000, 80000, 90000,
    80000, 90000, 70000, 80000, 80000, 70000,
    70000, 70000, 70000, 80000, 80000, 90000,
    90000, 80000, 70000, 80000, 70000, 70000,
];

function generate_random_flat_consumption(){
    let result = [];
    FLAT_CONSUMPTION.map((power_consumption) => {
        let t = Math.floor((1 + Math.random()%0.2) * power_consumption);
        result.push(t);
    });
    return result;
}

function generate_random_factory_consumption(){
    let result = [];
    FACTORY_CONSUMPTION.map((power_consumption) => {
        let t = Math.floor((1 + Math.random()%0.2) * power_consumption);
        result.push(t);
    });
    return result;
}

async function run(){
    console.log("Simulation is being started...");
    let flats = [];
    for(let i = 0; i < NUMBER_OF_FLATS; i++){
        let t = {
            id: i,
            consumption: generate_random_flat_consumption()
        };
        await to_promise(contract.addNewUser, `flat_${i}`, 'consumer', t.consumption, {
            from: accounts[10+i].address,
            gas: 3000000
        });
        flats.push(t)

    }
    let factories = [];
    for(let i = 0; i < NUMBER_OF_FACTORIES; i++){
        let t = {
            id: i,
            consumption: generate_random_factory_consumption()
        };
        await to_promise(contract.addNewUser, `factory_${i}`, 'factory', t.consumption, {
            from: accounts[70+i].address,
            gas: 3000000
        });
        factories.push(t)
    }

    setInterval(async () => {
        let not_error = true;
        let current_time =  Number(await to_promise(contract.getTime, {
            from: config.ethereum.observer.observer_ethereum_address,
            gas: 3000000
        }));


        for(let i = 0; i < flats.length; i++){
            try{
                await to_promise(contract.addNewSlot, flats[i].consumption[current_time%24], {
                    from: accounts[10+i].address,
                    gas: 3000000
                })
            }catch (err){
                console.error(`Error occurred while adding a new slot for a flat with id = ${i} and with account = ${accounts[i+10].address}`);
                console.error(err);
                not_error = false;
            }
        }

        for(let i = 0; i < factories.length; i++){
            try{
                await to_promise(contract.addNewSlot, factories[i].consumption[current_time%24], {
                    from: accounts[i+70].address,
                    gas: 3000000
                })
            }catch (err){
                console.error(`Error occurred while adding new slot for a factory with id = ${i} and with account = ${accounts[i+70].address}`);
                console.error(err);
                not_error = false;
            }
        }
        if(not_error){
            console.log("New slots successfully added for factories and flats, time =", current_time)
        }
    }, 10000);
    console.log("Simulation is working now");

}
run();




