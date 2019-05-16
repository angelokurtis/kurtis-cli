'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function resize() {
    try {
        await require(`${ROOT_PATH}/middleware/gcloud/resize-kubernetes-cluster`)();
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(resize);
};
