'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function clean() {
    try {
        let exitedIds = await require('../../../../middleware/docker/clear-exited-containers')();
        handle.success(exitedIds);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Clean Docker containers by removing all exited images')
        .action(clean);
};
