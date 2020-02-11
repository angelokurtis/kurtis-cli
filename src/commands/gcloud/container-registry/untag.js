'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const rmTags = require(`${ROOT_PATH}/middleware/gcloud/rm-tags`);

async function untag() {
    try {
        await rmTags();
        handle.success(images);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(untag);
};
