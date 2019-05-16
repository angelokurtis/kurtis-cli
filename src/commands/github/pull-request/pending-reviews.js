'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler/index');
const Aigle = require('aigle');
const _ = require('lodash');

async function pendingReviews(args, {organization, repositories, approved}) {
    try {
        const repos = repositories && repositories.length > 0 ? repositories
            : await require('../../../../middleware/github/list-repositories')(organization);
        const pulls = await Aigle
            .flatMap(repos, async repo => {
                const listPullRequests = approved ?
                    require(`../../../../middleware/github/list-reviewed-pull-requests`) :
                    require(`../../../../middleware/github/list-pending-pull-requests`);
                return listPullRequests(organization, repo)
            })
            .filter(({reviews}) => {
                const index = _.findIndex(reviews, ({user, state}) => user === 'angelokurtis' && state === 'APPROVED');
                return index < 0;
            })
            .orderBy(['created'], ['desc'])
            .map(pull => {
                const {created, updated} = pull;
                pull['created'] = created.fromNow();
                pull['updated'] = updated.fromNow();
                return pull;
            });
        handle.success(pulls);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'List all pending pull requests')
        .option('--approved', 'Filter just approved', cli.BOOLEAN)
        .option('--organization <organization>', 'The organization owner of the repositories', cli.STRING)
        .option('--repositories <repositories>', 'Filter by repositories', cli.LIST)
        .action(pendingReviews);
};
