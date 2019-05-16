'use strict';

const ROOT_PATH = '../../../../';

const cli = require('caporal');
const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function create(args, {project, zone, name, nodes}) {
    try {
        await require(`${ROOT_PATH}/middleware/gcloud/create-kubernetes-cluster`)(project, zone);
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .option('--project <project>', '', cli.STRING)
        .option('--zone <zone>', '', cli.STRING)
        // .option('--name <name>', '', cli.STRING)
        // .option('--nodes <nodes>', '', cli.INTEGER)
        .action(create);
};
