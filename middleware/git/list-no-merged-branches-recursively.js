'use strict';

const Aigle = require('aigle');
const bash = require('../bash');
const path = require('path');

async function listNoMergedBranchesRecursively(projectPath) {
    projectPath = projectPath || './';
    projectPath = `${path.resolve(projectPath)}/`;

    const projects = await bash(`find ${projectPath} -type d -iname '.git'`);
    return await Aigle.resolve(projects)
        .map(async project => ({project, branches: await require('./list-no-merged-branches')(project)}))
        .filter(({branches}) => branches.length > 0);
}

module.exports = listNoMergedBranchesRecursively;