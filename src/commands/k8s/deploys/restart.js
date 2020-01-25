'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const sh = require(`${ROOT_PATH}/middleware/bash`);

const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function clean() {
    try {
        const deploys = await require(`${ROOT_PATH}/middleware/k8s/select-deploys`)();
        for (const {name, namespace, replicas} of deploys) {
            await sh(`kubectl scale deploy ${name} --replicas=0 -n ${namespace}`, true);
            await sh(`kubectl scale deploy ${name} --replicas=${replicas} -n ${namespace}`, true);
        }
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .action(clean);
};
