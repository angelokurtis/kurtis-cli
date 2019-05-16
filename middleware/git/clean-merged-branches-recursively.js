'use strict';

const Aigle = require('aigle');
const bash = require('../bash');
const path = require('path');

async function cleanMergedBranchesRecursively(projectPath) {
    projectPath = projectPath || './';
    projectPath = `${path.resolve(projectPath)}/`;

    const projects = await bash(`find ${projectPath} -type d -iname '.git'`);
    await Aigle.resolve(projects)
        .map(async project => ({project, branches: await require('./list-merged-branches')(project)}))
        .filter(({branches}) => branches.length > 0)
        .forEach(({project, branches}) => bash(`git --git-dir '${project}' branch -D ${branches.join(' ')}`, true));
}

module.exports = cleanMergedBranchesRecursively;