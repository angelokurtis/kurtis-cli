'use strict';

const ROOT_PATH = '../../../../';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function getCredentials(args, options) {
    try {
        await require(`${ROOT_PATH}/middleware/gcloud/cluster-get-credentials`)();
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(getCredentials);
};
