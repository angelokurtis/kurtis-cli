'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');

async function cleanMergedRecursively(args, {path: projectPath}) {
    try {
        const noMergedBranches = await require('../../../../middleware/git/list-no-merged-branches-recursively')(projectPath);
        noMergedBranches.forEach(({project, branches}) => {
            console.log(project.replace('/.git', ''));
            branches.forEach(branch => console.log(`\t> ${branch}`))
        })
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List Git branches that has not been merged into develop')
        .option('--path <path>', 'The location that you wish to search', cli.STRING)
        .action(cleanMergedRecursively);
};
