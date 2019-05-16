'use strict';

const Aigle = require('aigle');
const bash = require('../bash');
const path = require('path');

async function listMergedBranches(projectPath) {
    projectPath = projectPath || './';
    projectPath = `${path.resolve(projectPath)}/`;

    try {
        const branches = await bash(`git --git-dir '${projectPath}' branch --merged origin/develop`);
        return await Aigle.resolve(branches)
            .filter(branch => !branch.startsWith('*'))
            .map(branch => branch.trim())
            .filter(branch => branch !== 'develop' && branch !== 'master');
    } catch (e) {
        const {stderr} = e;
        if (!stderr.startsWith('fatal: malformed object name ')) throw e;
        return [];
    }
}

module.exports = listMergedBranches;