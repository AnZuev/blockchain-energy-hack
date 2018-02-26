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

const Router = require('koa-router');
const contract = require("../core/index")();

let router = new Router();

router.get('/', (ctx, next) => {
    // ctx.router available
});

// ...


module.exports = router
