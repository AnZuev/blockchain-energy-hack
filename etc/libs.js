"use strict";

/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 02/03/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */

module.exports.to_promise = (f, ...args) => {
    return new Promise((resolve, reject) => {
        if(args){
            f(...args, (err, res) => {
                if(err){
                    reject(err)
                }else{
                    resolve(res)
                }
            })
        }else{
            f((err, res) => {
                if(err){
                    reject(err)
                }else{
                    resolve(res)
                }
            })
        }

    })
};