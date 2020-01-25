'use strict';

const bash = require('../bash');
const Aigle = require('aigle');
const moment = require('moment-timezone');

async function listEvents() {
    const {items} = await bash('kubectl get event --all-namespaces -o json', true);
    return Aigle
        .resolve(items)
        .map(function ({firstTimestamp, reason, involvedObject, message}) {
            return {
                // time: firstTimestamp,
                time: moment.tz(firstTimestamp, 'America/Sao_Paulo'),
                reason: reason,
                kind: involvedObject['kind'],
                name: involvedObject['name'],
                namespace: involvedObject['namespace'],
                message: message,
            }
        })
        .orderBy('time', 'desc');
}

module.exports = listEvents;