'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function list() {
    try {
        const projects = await require(`${ROOT_PATH}/middleware/gcloud/list-projects`)();
        handle.success(projects);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
