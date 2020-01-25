'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const Table = require('cli-table');

const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function clean(args, {limit}) {
    try {
        await require(`${ROOT_PATH}/middleware/k8s/clean-pods`)();
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(clean);
};
