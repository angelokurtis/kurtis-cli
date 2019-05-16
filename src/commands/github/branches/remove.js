'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const inquirer = require('inquirer');

async function remove(args, {organization, author, merged}) {
    try {
        const repos = await require('../../../../middleware/github/list-repositories')(organization);
        const mergedBranches = await Aigle.resolve(repos)
            .flatMap(repo => require('../../../../middleware/github/list-branches')(organization, repo))
            .filter(({merged: isMerged}) => !merged || isMerged)
            .filter(({author: branchOwner}) => !author || branchOwner === author);

        const allRepositories = await Aigle.map(mergedBranches, 'repository').uniq();
        let question1 = [{
            type: 'checkbox',
            name: 'repositories',
            message: 'Choose the repository:',
            choices: allRepositories
        }];
        const answer1 = await inquirer.prompt(question1);
        const {repositories: selectedRepositories} = answer1;

        const branches = await Aigle.filter(mergedBranches, ({repository}) => selectedRepositories.includes(repository));
        const allBranches = await Aigle.map(branches, 'branch').uniq();
        let question2 = [{
            type: 'checkbox',
            name: 'branches',
            message: 'Choose the branches:',
            choices: allBranches
        }];
        const answer2 = await inquirer.prompt(question2);
        const {branches: selectedBranches} = answer2;
        const branchesToDelete = await Aigle.filter(branches, ({branch}) => selectedBranches.includes(branch));

        handle.success(branchesToDelete);
        let question3 = {type: 'confirm', name: 'confirmation', message: 'Are you sure?'};
        const {confirmation} = await inquirer.prompt(question3);

        if (confirmation) {
            await Aigle.resolve(branchesToDelete)
                .forEach(({repository, branch}) => require('../../../../middleware/github/delete-branch')(organization, repository, branch));
        }
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
        .action(remove);
};
