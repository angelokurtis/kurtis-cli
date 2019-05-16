'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function cleanAllButDevelop(args, {path: projectPath}) {
    try {
        await require('../../../../middleware/git/clean-all-but-develop')(projectPath);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Clean all Git branches that has been already merged into develop')
        .option('--path <path>', 'The location that you wish to search', cli.STRING)
        .action(cleanAllButDevelop);
};
