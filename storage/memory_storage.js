"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 27/02/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */


// for simplicity a memory storage is used

// user actually is an object:
// { name, title, telegram: { full_name, user_id, alias}
class MemoryStorage{
    constructor(){
        this.users = {}
    }

    setUser(address, user){
        this.users[address] = user
    }

    getUser(address){
        return this.users[address]
    }

}


let memoryStorage = new MemoryStorage();

module.exports = memoryStorage;