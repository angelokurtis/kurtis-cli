'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');

async function describeLogStreamsByTimestamp(logGroupName, timestamp) {
    if (!logGroupName) throw new Error('log group name should not be null');
    if (!timestamp) throw new Error('timestamp should not be null');

    const {logStreams} = await bash(`aws logs describe-log-streams --log-group-name '${logGroupName}' --order-by 'LastEventTime' --descending --max-items 100`);
    return await Aigle.filter(logStreams, ({lastEventTimestamp}) => lastEventTimestamp >= timestamp);
}

module.exports = describeLogStreamsByTimestamp;
