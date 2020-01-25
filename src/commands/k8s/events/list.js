'use strict';

const ROOT_PATH = '../../../..';

const cli = require('caporal');
const Table = require('cli-table');

const handle = require(`${ROOT_PATH}/middleware/output-handler`);

async function list(args, {limit}) {
    limit = limit || 10;
    try {
        const events = await require(`${ROOT_PATH}/middleware/k8s/list-events`)();
        const table = new Table({
            head: [
                'TIME',
                'KIND',
                'NAME',
                'NAMESPACE',
                'REASON',
                'MESSAGE'
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
        for (let i = 0; i < limit; i++) {
            if (events.length <= i) break;
            const {time, reason, kind, name, namespace, message} = events[i];
            table.push([
                time.fromNow() || '',
                kind || '',
                name || '',
                namespace || '',
                reason || '',
                message || ''
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
        .option('--limit <limit>', 'The rows limit', cli.INT)
        .action(list);
};
