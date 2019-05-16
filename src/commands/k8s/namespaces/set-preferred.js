'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function setPreferred() {
    try {
        const namespace = await require(`${ROOT_PATH}/middleware/k8s/select-namespace`)();
        await require(`${ROOT_PATH}/middleware/k8s/set-preferred`)(namespace);
        handle.success({namespace});
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(setPreferred);
};
