const contract = require('./core/index.js')();
let libs = require("./etc/libs");

async function f() {
    let result = await libs.to_promise(contract.getTime, {from: global.observer_ethereum_address});
    console.log(result)
}
f();