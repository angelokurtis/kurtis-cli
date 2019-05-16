'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const moment = require('moment-timezone');

async function logs(args, {minutes, hours, logGroupName, traceId, simplify}) {
    try {
        if (minutes && hours) throw new Error('It should must be informed only one of minutes or hours');
        minutes = hours ? hours * 60 : minutes || 30;
        const now = new Date();
        now.setMinutes(now.getMinutes() - minutes);
        console.log(JSON.stringify({debug: `Getting logs from ${moment.tz(now, "America/Sao_Paulo").format()} until now`}));
        let timestamp = now.getTime();

        const logGroups = logGroupName ?
            await require('../../../../middleware/aws/cloudwatch/describe-log-group')(logGroupName) :
            await require('../../../../middleware/aws/cloudwatch/select-log-groups')();
        const logs = await Aigle
            .map(logGroups, ({logGroupName}) => logGroupName)
            .flatMap(async logGroupName => await require('./../../../../middleware/aws/cloudwatch/get-logs-by-timestamp')(logGroupName, timestamp, traceId))
            .orderBy('timestamp', 'asc')
            .map(({logGroupName, timestamp, message}) => {
                timestamp = moment.tz(timestamp, "America/Sao_Paulo").format('YYYY-MM-DD H:mm:ss.SSS');
                message = ifObjectGetJSON(message);
                return {logGroupName, timestamp, message};
            });
        if (simplify) {
            handle.success((await Aigle.map(logs, function (log) {
                const timestamp = log.timestamp;
                const level = log.message.level;
                const logGroupName = log.logGroupName;
                const traceId = log.message.mdc ? log.message.mdc.traceId : null;
                const message = log.message.message;
                return `${timestamp} [${level}] {${logGroupName}, ${traceId}} - ${message}`;
            })).join('\n'));
        } else {
            handle.success(logs)
        }
    } catch (e) {
        handle.error(e);
    }
}

function ifObjectGetJSON(string) {
    try {
        const object = JSON.parse(string);
        if (object && typeof object === 'object') return object;
    } catch (e) {
    }
    return string;
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-m, --minutes <minutes>', '')
        .option('-h, --hours <hours>', '')
        .option('--log-group-name <log-group-name>', '')
        .option('-t, --trace-id <trace-id>', '')
        .option('-s, --simplify', 'Simplify the output')
        .action(logs);
};
