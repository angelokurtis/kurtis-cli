'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function remove(args, {name}) {
    try {
        await require(`${ROOT_PATH}/middleware/gcloud/remove-kubernetes-cluster`)(name);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .option('--name <name>', '', cli.STRING)
        .action(remove);
};
