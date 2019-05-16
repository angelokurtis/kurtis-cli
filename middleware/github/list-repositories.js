'use strict';

const Aigle = require('aigle');
const axios = require('axios');

async function listRepositories(organizationName) {
    if (!organizationName) throw new Error('The organization name should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/orgs/${organizationName}/repos`;
    const {data} = await axios.get(endpoint, {headers});
    return await Aigle.map(data, ({name}) => name);
}

module.exports = listRepositories;