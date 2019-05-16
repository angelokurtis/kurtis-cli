'use strict';

const bash = require('../../bash');

async function listLogGroups() {
    const {logGroups} = await bash(`aws logs describe-log-groups`);
    return logGroups;
}

module.exports = listLogGroups;