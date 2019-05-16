'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function list() {
    try {
        const clusters = await require(`${ROOT_PATH}/middleware/gcloud/list-kubernetes-cluster`)();
        handle.success(clusters);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
