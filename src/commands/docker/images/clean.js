'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function clean() {
    try {
        let danglingIds = await require('../../../../middleware/docker/clear-dangling-images')();
        handle.success(danglingIds);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Clean Docker images by removing all dangling images')
        .action(clean);
};
