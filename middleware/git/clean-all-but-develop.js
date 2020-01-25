'use strict';

const Aigle = require('aigle');
const bash = require('../bash');
const path = require('path');

async function cleanAllButDevelop(projectPath) {
    projectPath = projectPath || './';
    projectPath = `${path.resolve(projectPath)}/`;

    const projects = await bash(`find ${projectPath} -type d -iname '.git'`);
    await Aigle.resolve(projects)
        .forEach(async function (project) {
            const currentBranch = (await run({cmd: 'git rev-parse --abbrev-ref HEAD', dir: project}))[0];
            if (currentBranch !== 'develop') {
                await run({cmd: 'git checkout develop --', dir: project}, true);
            }
            await run({cmd: 'git pull', dir: project}, true);
        });

    await Aigle.resolve(projects)
        .map(async project => ({project, branches: await require('./list-all-branches')(project)}))
        .filter(({branches}) => branches.length > 0)
        .forEach(({project, branches}) => bash({
            cmd: `git branch -D ${branches.join(' ')}`,
            dir: project
        }, true));
}

async function run(command, debug) {
    try {
        return await bash(command, debug);
    } catch ({stderr}) {
        if (stderr) throw stderr;
    }
}

module.exports = cleanAllButDevelop;