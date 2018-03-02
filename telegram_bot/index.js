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

var users = {};

console.log("Starting telegram bot...");


const Telegraf = require('telegraf');

const bot = new Telegraf(config.telegram_bot.token);
bot.start((ctx) => {
    return ctx.reply('Welcome, ' + ctx.from.first_name + '! Use /secret to generate a secret number for your Ethereum address.');
});

bot.command('secret', (ctx) => {
    let secretNumber = 1000 + Math.floor(Math.random() * 9000);
    if (!(ctx.from.id in users)) {
        users[ctx.from.id] = {'secretNumber': secretNumber, 'context': ctx, 'isConnected': false};
        ctx.reply('Your secret number is ' + secretNumber + ' . To connect your Telegram account, go to the website and enter it there.');
    }
    else {
        ctx.reply("You've already got a secret number.");
    }

    const timer = setInterval(() => {
        users[ctx.from.id]['isConnected'] = checkIfUserHasConnected(secretNumber);
        if (users[ctx.from.id]['isConnected']) {
            clearInterval(timer);
            console.log('timer cleared');
            return ctx.reply("You're connected! Click /remind if you wish to be reminded of the offers you've taken.");
        }
    }, 10000);

});

bot.command('remind', (ctx) => {
    setInterval( () => {
        let currentOffer = getUserClosestOffer(users[ctx.from.id].secretNumber);
        if (currentOffer !== undefined) {

        }
    }, 10000);

});

async function getUserClosestOffer(secretNumber) {
    return await libs.to_promise(contract.TG_getClosestOffer, secretNumber, {from: global.observer_ethereum_address});
}

async function checkIfUserHasConnected(secretNumber) {
    let result = await libs.to_promise(contract.checkIsUserHasConnected, secretNumber, {from: global.observer_ethereum_address});
    if (result.toString() === 'true') return true;
    else return false;
}

bot.startPolling();

console.log("Telegram bot has beed started");