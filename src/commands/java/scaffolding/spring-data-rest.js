'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function springDataRest(args, {projectName}) {
    try {
        await require('../../../../middleware/java/generate-spring-data-rest-scaffolding')(projectName)
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('--project-name <project-name>', '', cli.STRING)
        .action(springDataRest);
};
