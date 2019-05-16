'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function cleanMerged(args, {path: projectPath}) {
    try {
        await require('../../../../middleware/git/clean-merged-branches-recursively')(projectPath);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Clean all Git branches that has been already merged into develop')
        .option('--path <path>', 'The location that you wish to search', cli.STRING)
        .action(cleanMerged);
};
