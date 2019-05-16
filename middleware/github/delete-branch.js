'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const axios = require('axios');

async function deleteBranch(organizationName, repository, branch) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');
    if (!branch) throw new Error('branch should not be null');

    let token = '';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/repos/${organizationName}/${repository}/git/refs/heads/${encodeURI(branch)}`;
    await axios.delete(endpoint, {headers});
}


module.exports = deleteBranch;