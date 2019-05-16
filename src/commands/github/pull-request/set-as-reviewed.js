'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler/index');

async function setAsReviewed(args, {pullRequestId}) {
    try {
        const reviews = await require('../../../../middleware/github/add-review')(pullRequestId);
        handle.success(reviews);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Set pull request as reviewed')
        .option('--pull-request-id <pull-request-id>', 'The ID of the reviewed pull request', cli.STRING)
        .action(setAsReviewed);
};
