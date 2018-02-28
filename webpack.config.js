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

let path = require('path');

let BUILD_DIR = path.resolve(__dirname, 'web/client/public/js/');
let APP_DIR = path.resolve(__dirname, 'web/client/src/');

let config = {
    context: APP_DIR,
    entry: {
        home: "./pages/home.jsx",
        monitoring: "./pages/monitoring.jsx"
    },
    output: {
        path: BUILD_DIR,
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
};


module.exports = config;
