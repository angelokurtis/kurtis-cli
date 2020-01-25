'use strict';

const cli = require('caporal');
const handle = require('../../../middleware/output-handler');
const sh = require('../../../middleware/bash');
const path = require('path');

async function openProject(args, {projectPath}) {
    projectPath = projectPath || '.';
    projectPath = `${path.resolve(projectPath)}/`;
    try {
        const command = `idea1 ${projectPath}`;
        await sh(`nohup ${command} >/dev/null 2>&1 &`, true);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-p, --project-path <project-path>', '', cli.STRING)
        .action(openProject);
};