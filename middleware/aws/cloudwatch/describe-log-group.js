'use strict';

const bash = require('../../bash');

async function describeLogGroup(logGroup) {
    if (!logGroup) throw new Error('The log group name should not be null');

    const {logGroups} = await bash(`aws logs describe-log-groups --log-group-name-prefix ${logGroup}`);
    return logGroups;
}

module.exports = describeLogGroup;