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
const contract = require("../../core/index")();
const memoryStorage = require("../../storage/memory_storage");

let router = new Router();


router.get('/', async (ctx, next) => {
    await ctx.render("home", { title : 'Home Page' })
});

router.get('/api/get_user', (ctx, next) => {
    let user_id = ctx.request.query.address;

    let user = memoryStorage.getUser(user_id);
    if(user){
        ctx.body = {error: false, code: 200, result: user};
    }else{
        ctx.body = {error: true, code: 404, result: null};
    }
});

router.post("/api/add_new_user", (ctx, next) => {
    let data = ctx.request.body;
    let user = memoryStorage.getUser(data.address);
    if(user){
        ctx.body = {error: true, code: 400, message: "User already exists"}
    }else{
        user = {
            name: data.title,
            type: data.type,
            telegram: null
        };
        memoryStorage.setUser(data.address, user);
        ctx.body = {error: false, code: 200, result: user};
    }
});



// ...


module.exports = router;
