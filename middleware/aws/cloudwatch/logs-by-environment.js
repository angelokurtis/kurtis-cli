'use strict';

const bash = require('../../bash');
const moment = require('moment-timezone');
const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);

// const {clusters} = JSON.parse(require('fs').readFileSync(`${__dirname}/../properties.json`, 'utf8'));

async function logsByEnvironment(environmentName, minutes, traceId, simplify) {
    if (!environmentName) throw new Error('environment name should not be null');

    minutes = minutes || 30;
    const now = new Date();
    now.setMinutes(now.getMinutes() - minutes);
    // console.log(JSON.stringify({debug: `Getting logs from ${moment.tz(now, "America/Sao_Paulo").format()} until now`}));
    let timestamp = now.getTime();

    const index = _.findIndex(clusters, cluster => cluster['environment'] === environmentName);
    const prefix = clusters[index]['logGroupNamePrefix'];

    const {logGroups} = await bash(`aws logs describe-log-groups --log-group-name-prefix '${prefix}'`);
    const logs = await Aigle
        .map(logGroups, ({logGroupName}) => logGroupName)
        .flatMap(async function (logGroupName) {
            return await require('./get-logs-by-timestamp')(logGroupName, timestamp, traceId)
        })
        .orderBy('timestamp', 'asc')
        .map(({logGroupName, timestamp, message}) => {
            timestamp = moment.tz(timestamp, "America/Sao_Paulo").format();
            message = ifObjectGetJSON(message);
            return {logGroupName, timestamp, message};
        });
    if (simplify) {
        return await Aigle.map(logs, function (log) {
            const timestamp = log.timestamp;
            const level = log.message.level;
            const logGroupName = log.logGroupName;
            const traceId = log.message.mdc ? log.message.mdc.traceId : null;
            const message = log.message.message;
            return `${timestamp} [${level}] {${logGroupName}, ${traceId}} - ${message}`;
        })
    }
    return logs;
}

function ifObjectGetJSON(string) {
    try {
        const object = JSON.parse(string);
        if (object && typeof object === 'object') return object;
    } catch (e) {
    }
    return string;
}


module.exports = logsByEnvironment;