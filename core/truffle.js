const config = require("../config.json");
module.exports = {
    networks: {
        development: {
            host: config.ethereum.node.host,
            port: config.ethereum.node.port,
            network_id: config.ethereum.node.network_id
        }
    }
};

