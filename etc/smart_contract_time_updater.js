"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 01/03/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */

const contract = require('../core/index.js')();
const web3 = require("web3");
let libs = require("../etc/libs");
const config = require("../config.json");
let timer = null;
let time = 1;

module.exports.start = () => {
    if(!timer){
        timer = setInterval(async ()=>{
            try{
                // returns tx hash
                let result = await libs.to_promise(contract.updateTime, time, {from: global.observer_ethereum_address});
                console.log(result);
                console.log("Time has been updated. Now: ", time);
                let timeS = await libs.to_promise(contract.getTime, {from: global.observer_ethereum_address});
                console.log(timeS.toString())
            }catch (err){
                console.error("Error while time updates on smart contract");
                console.error(err)
            }
            time += 1;
        }, 30000)
    }else{
        console.log("Timer is on already")
    }
};

module.exports.stop = () => {
    if(timer){
        clearInterval(timer);
        console.log("Timer has been stopped");
    }
    console.log("Timer is not working now")
};

module.exports.get_time = () => {
    return time;
};