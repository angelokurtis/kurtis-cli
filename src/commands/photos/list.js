'use strict';

const ROOT_PATH = '../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function list() {
    try {
        const photos = await require(`${ROOT_PATH}/middleware/photos/list-all-photos`)();
        handle.success(photos);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
