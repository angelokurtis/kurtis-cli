'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const selectUntagged = require(`${ROOT_PATH}/middleware/gcloud/select-untagged`);

async function clean() {
    try {
        const images = await selectUntagged();
        handle.success(images);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(clean);
};
