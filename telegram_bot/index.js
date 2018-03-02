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
console.log("Starting telegram bot...");


const Telegraf = require('telegraf');

const bot = new Telegraf(config.telegram_bot.token);
bot.start((ctx) => {
    return ctx.reply('Welcome!')
});

bot.on("/test", async (ctx) => {

});

bot.startPolling();

console.log("Telegram bot has beed started");