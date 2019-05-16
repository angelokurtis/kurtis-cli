'use strict';

const Aigle = require('aigle');

async function getLogsByTimestamp(logGroupName, timestamp, traceId) {
    if (!logGroupName) throw new Error('log group name should not be null');
    if (!timestamp) throw new Error('timestamp should not be null');

    const logStreams = await require('./describe-log-streams-by-timestamp')(logGroupName, timestamp);
    return await Aigle
        .map(logStreams, ({logStreamName}) => ({logGroupName, logStreamName}))
        .flatMap(({logGroupName, logStreamName}) => require('./log-events-by-timestamp')(logGroupName, logStreamName, timestamp, traceId))
        .filter(log => log)
        .map(log => {
            log['logGroupName'] = logGroupName;
            return log;
        });
}


module.exports = getLogsByTimestamp;