'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function list() {
    try {
        const namespaces = await require(`${ROOT_PATH}/middleware/k8s/list-namespaces`)();
        handle.success(namespaces);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(list);
};
