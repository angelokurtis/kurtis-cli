'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function vertx(args, {projectName}) {
    try {
        await require('../../../../middleware/java/generate-vertx-scaffolding')(projectName)
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--project-name <project-name>', '', cli.STRING)
        .action(vertx);
};
