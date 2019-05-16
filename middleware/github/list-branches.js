'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const axios = require('axios');
const moment = require('moment-timezone');

async function listBranches(organizationName, repository) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/repos/${organizationName}/${repository}/branches`;
    const {data} = await axios.get(endpoint, {headers});
    return await Aigle.resolve(data)
        .filter(({name}) => name !== 'master' && name !== 'develop')
        .map(async ({name}) => {
            const merged = await wasMerged(organizationName, repository, name);
            return {repository, branch: name, merged}
        })
        .map(async ({branch, merged}) => {
            const detailedBranch = await branchDetails(organizationName, repository, branch);
            const date = moment(detailedBranch['date']).tz('America/Sao_Paulo');
            detailedBranch['date'] = date.format();
            detailedBranch['since'] = date.fromNow();
            detailedBranch['merged'] = merged;
            return detailedBranch;
        });
}

async function wasMerged(organizationName, repository, branch) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');
    if (!branch) throw new Error('branch should not be null');

    const prs = await listPullRequestsByBranch(organizationName, repository, branch);
    const mergedPrs = await Aigle.resolve(prs).filter(({merged_at}) => merged_at);
    return mergedPrs.length > 0;
}

async function listPullRequestsByBranch(organizationName, repository, branch) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');
    if (!branch) throw new Error('branch should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/repos/${organizationName}/${repository}/pulls?state=all&head=${organizationName}:${encodeURI(branch)}`;
    const {data} = await axios.get(endpoint, {headers});
    return await Aigle.resolve(data)
        .map(({merged_at, head}) => {
            const {ref} = head;
            return {repository, merged_at, branch: ref}
        })
}

async function branchDetails(organizationName, repository, branch) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');
    if (!branch) throw new Error('branch should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/repos/${organizationName}/${repository}/branches/${encodeURI(branch)}`;
    const {data} = await axios.get(endpoint, {headers});
    const {name, commit} = data;
    const {author, commit: lastCommit} = commit;
    const {date} = lastCommit['author'];
    return {author: author['login'], date, branch: name, repository};
}

module.exports = listBranches;