'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const Aigle = require('aigle');

async function list(args, {organization, author, merged}) {
    try {
        const repos = await require('../../../../middleware/github/list-repositories')(organization);
        const mergedBranches = await Aigle.resolve(repos)
            .flatMap(repo => require('../../../../middleware/github/list-branches')(organization, repo))
            .filter(({merged: isMerged}) => !merged || isMerged)
            .filter(({author: branchOwner}) => !author || branchOwner === author);
        handle.success(mergedBranches);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List all merged branches')
        .option('--author <username>', 'The username of the branch owner', cli.STRING)
        .option('--organization <organization>', 'The organization owner of the repositories', cli.STRING)
        .option('--merged', 'Filter merged branches', cli.BOOL)
        .action(list);
};
