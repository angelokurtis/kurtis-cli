'use strict';

const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);

async function tailLogs(logGroupName, hours) {
    if (!logGroupName) throw new Error('log group name should not be null');

    hours = hours || 24;
    const now = new Date();
    now.setHours(now.getHours() - hours);

    let timestamp = now.getTime();

    setInterval(async function () {
        const logs = await require('./get-logs-by-timestamp')(logGroupName, timestamp);
        const sortedLogs = await Aigle
            .orderBy(logs, 'timestamp', 'asc')
            .filter(log => log);

        if (sortedLogs.length > 0) timestamp = _.last(sortedLogs).timestamp;

        sortedLogs
            .map(log => JSON.parse(log.message))
            .forEach(({timestamp, level, message}) => console.log(`${timestamp} [${level}] ${message}`));
    }, 2000);
}


module.exports = tailLogs;