'use strict';

const bash = require('../../bash');

async function logEventsByTimestamp(logGroupName, logStreamName, timestamp, traceId) {
    if (!logGroupName) throw new Error('log group name should not be null');
    if (!logStreamName) throw new Error('log stream name should not be null');
    if (!timestamp) throw new Error('timestamp should not be null');

    ++timestamp;
    if (traceId) {
        let {events} = await bash(`aws logs filter-log-events --log-group-name '${logGroupName}' --log-stream-name-prefix '${logStreamName}' --start-time ${timestamp} --filter-pattern '{ $.mdc.traceId = "${traceId}" }'`);
        return events;
    }

    let {events, nextForwardToken: forwardToken, nextBackwardToken: backwardToken} = await bash(`aws logs get-log-events --log-group-name '${logGroupName}' --log-stream-name '${logStreamName}' --start-time ${timestamp}`);
    let forward = forwardToken.replace('f/', '');
    let backward = backwardToken.replace('b/', '');

    while (forward !== backward) {
        // await sleep(1000);
        const {nextEvents, nextForwardToken, nextBackwardToken} = await bash(`aws logs get-log-events --log-group-name '${logGroupName}' --log-stream-name '${logStreamName}' --start-time ${timestamp} --next-token '${forwardToken}'`);
        forwardToken = nextForwardToken;
        backwardToken = nextBackwardToken;
        forward = forwardToken.replace('f/', '');
        backward = backwardToken.replace('b/', '');
        events = events.concat(nextEvents);
    }
    return events;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = logEventsByTimestamp;