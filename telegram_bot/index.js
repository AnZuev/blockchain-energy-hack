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

const config = require("../config.json");
const contract = require("../core/index")();
let libs = require("../etc/libs");
let time_updater = require("../etc/smart_contract_time_updater");

var users = {};

//let currentOffers = [{id: 1, startTime: 10, endTime: 20, power: 5, address: '0x000'}, {id: 2, startTime: 30, endTime: 40, power: 5, address: '0x000'},]; // a variable for notifications
let currentOffers = [];
let event = contract.OfferResponded();
event.watch((err, res)=> {
    console.log(res.args);
    console.log(res.args.startTime.toString());
    currentOffers.push(res.args);
});



console.log("Starting telegram bot...");


const Telegraf = require('telegraf');

const bot = new Telegraf(config.telegram_bot.token);
bot.start((ctx) => {
    return ctx.reply('Welcome, ' + ctx.from.first_name + '! Use /secret to generate a secret number for your Ethereum address.');
});

bot.command('secret', (ctx) => {
    let secretNumber = 1000 + Math.floor(Math.random() * 9000);
    if (!(ctx.from.id in users)) {
        users[ctx.from.id] = {'secretNumber': secretNumber, 'context': ctx, 'isConnected': false, 'address': ''};
        ctx.reply('Your secret number is ' + secretNumber + '. To connect your Telegram account, go to the website and enter it there.');
    }
    else {
        ctx.reply("You've already got a secret number.");
    }

    const timer = setInterval(async () => {
        users[ctx.from.id]['isConnected'] = await checkIfUserHasConnected(secretNumber);
        if (users[ctx.from.id]['isConnected']) {
            clearInterval(timer);
            console.log('timer cleared');
            users[ctx.from.id]['address'] = await getUserAddress(secretNumber);
            return ctx.reply("You're connected! Click /remind if you wish to be reminded of the offers you've taken.");
        }
    }, 100);

});

bot.command('remind', (ctx) => {
    const timer = setInterval(() => {
        currentOffers.map((offer, index) => {
            if (offer['user_address'].toString() === users[ctx.from.id]['address']) {
                if (Number(offer.startTime.toString()) - time_updater.get_time() < 20) {
                    ctx.reply("Don't forget about offer #" + offer['offer_id'] + "! From " + offer.startTime.toString() + " to " + offer.endTime.toString() + " your consumption should decrease by " +
                        offer.promisedPower.toString() + ". Go to the website to turn off your devices.");
                    currentOffers.splice(index, 1);
                }
            }
        });
    }, 10000);


});


async function checkIfUserHasConnected(secretNumber) {
    let result = await libs.to_promise(contract.checkIsUserHasConnected, secretNumber, {from: global.observer_ethereum_address});
    console.log("checking connection");
    console.log(result.toString() === 'true');
    return result.toString() === 'true';
}

async function getUserAddress(secretNumber) {
    let result = await libs.to_promise(contract.getAddress, secretNumber, {from: global.observer_ethereum_address});
    console.log("getting user address");
    console.log(result);
    return result.toString();
}

bot.startPolling();

console.log("Telegram bot has beed started");