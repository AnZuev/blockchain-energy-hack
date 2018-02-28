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

const config = require("../../config.json");
console.log("Starting web-server...");

const Koa = require('koa');
const app = new Koa();
const router = require("./routes");
const serve = require("koa-static");
let path = require("path");
const views = require('koa-views');
const body = require('koa-json-body');

// response
app.use( async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    })
    .use(body({ limit: '10kb', fallback: true }))
    .use(views(path.join(__dirname, "../client/public/pages"), {
        map: {
            html: 'handlebars'
        }
    }))
    .use(serve(path.resolve(__dirname, "../client/public")))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.web_server.port);


console.log("Web-server has been started successfully");
