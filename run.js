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

global.observer_ethereum_address = require("./config.json").ethereum.observer.address;


// start bot
require('./telegram_bot/index');

// start web-server
require('./web/backend/index');

// start time updating
let timer = require('./etc/smart_contract_time_updater');
timer.start();



