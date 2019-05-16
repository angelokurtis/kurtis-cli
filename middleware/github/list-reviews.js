'use strict';

const Aigle = require('aigle');
const axios = require('axios');
const _ = require('lodash');

async function listReviews(organizationName, repository, pullRequestNumber) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');
    if (!pullRequestNumber) throw new Error('pull request number should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };

    const {data: data1} = await axios.get(`https://api.github.com/repos/${organizationName}/${repository}/pulls/${pullRequestNumber}/requested_reviewers`, {headers});
    const pendingRevisions = await Aigle.map(data1['users'], ({login}) => ({user: login, state: 'PENDING'}));

    const {data: data2} = await axios.get(`https://api.github.com/repos/${organizationName}/${repository}/pulls/${pullRequestNumber}/reviews`, {headers});
    const madeRevisions = await Aigle.map(data2, ({user, state}) => ({
        user: user['login'],
        state: state === 'COMMENTED' ? 'PENDING' : state
    }));

    const {data: data3} = await axios.get(`https://api.github.com/repos/${organizationName}/${repository}/pulls/${pullRequestNumber}`, {headers});
    const author = data3['user']['login'];

    const reviews = _.uniqWith(pendingRevisions.concat(madeRevisions), _.isEqual);
    return _.filter(reviews, ({user}) => user !== author);
}

module.exports = listReviews;