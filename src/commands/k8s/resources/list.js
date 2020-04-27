'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const Table = require('cli-table');
const Aigle = require('aigle');
const moment = require('moment-timezone');

const handle = require(`${ROOT_PATH}/middleware/output-handler`);
const sh = require(`${ROOT_PATH}/middleware/bash`);

async function list(args, {resources, labels, namespace}) {
    try {
        if (namespace) {
            namespace = `-n ${namespace}`
        } else {
            namespace = `--all-namespaces`
        }
        const labelMap = labels ? await Aigle.resolve(labels)
            .map(function (label) {
                const key = label.substr(0, label.indexOf('='));
                const value = label.substr(label.indexOf('=') + 1);
                return {key, value}
            }) : [];
        const {items} = await sh(`kubectl get ${resources.join(',')} ${namespace} -o json`);
        const result = await Aigle.resolve(items)
            .filter(function ({metadata}) {
                const {labels} = metadata;
                if (labelMap.length > 0) {
                    if (!labels) return false;
                    for (let i = 0; i < labelMap.length; i++) {
                        const {key, value} = labelMap[i];
                        if (labels[key] === value) {
                            return true
                        }
                    }
                    return false
                }
                return true
            })
            .map(function (item) {
                const {metadata} = item;
                const {creationTimestamp} = metadata;
                item.time = moment.tz(creationTimestamp, 'America/Sao_Paulo');
                return item
            })
            .orderBy('time', 'desc');

        const table = new Table({
            head: [
                'NAMESPACE',
                'NAME',
                'SINCE',
            ],
            chars: {
                'top': '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                'bottom': '',
                'bottom-mid': '',
                'bottom-left': '',
                'bottom-right': '',
                'left': '',
                'left-mid': '',
                'mid': '',
                'mid-mid': '',
                'right': '',
                'right-mid': '',
                'middle': ''
            }
        });
        for (let i = 0; i < result.length; i++) {
            if (result.length <= i) break;
            const {apiVersion, kind, metadata, time} = result[i];
            const {namespace, name} = metadata;
            const api = `${kind}.${apiVersion.split('/')[0]}/${name}`;
            table.push([
                namespace || '',
                api || '',
                time.fromNow() || ''
            ]);
        }
        handle.success(table.toString());
    } catch (e) {
        handle.error(e);
    }
}


module.exports = function (command) {
    cli
        .command(command, '')
        .option('--resources <resources>', '', cli.ARRAY)
        .option('--labels <labels>', '', cli.ARRAY)
        .option('--namespace <namespace>', '', cli.STRING)
        .action(list);
};
