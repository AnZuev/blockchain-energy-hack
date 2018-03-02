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

bot.command('remind', () => {
    setInterval( () => {
        // check if the user has offers in the next hour and get the data
        // use this data to remind the user

    }, 10000);

});

function getUserClosestOffer(secretNumber) {
    // go to contract and get user's promised offers - TODO: add the function to get user's closest offer
    let offer = {'startTime': 100000, 'endTime': 110000, 'promisedPower': 10};
    return offer;
}







function checkIfUserHasConnected(secretNumber) {
    // go to contract and see if the user is in secretNumbersTG - TODO: add the function
    return Math.random() > 0.5;
}

bot.startPolling();

console.log("Telegram bot has beed started");