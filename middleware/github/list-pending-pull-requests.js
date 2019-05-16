'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const axios = require('axios');
const moment = require('moment-timezone');

async function listPendingPullRequests(organizationName, repository) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');

    let token = 'ffd7a441a1f9429bc80e60b76e4e3ba6b3562573';
    let headers = {
        'Content-Type': 'application/vnd.github.v3+json',
        Authorization: `token ${token}`
    };
    let endpoint = `https://api.github.com/repos/${organizationName}/${repository}/pulls`;
    const {data} = await axios.get(endpoint, {headers});
    return await Aigle
        .map(data, ({id, title, html_url, user, created_at, updated_at, head, number}) => ({
            id,
            title,
            url: html_url,
            user: user['login'],
            created: moment(created_at, 'YYYY-MM-DD HH:mm Z').tz('America/Sao_Paulo'),
            updated: moment(updated_at, 'YYYY-MM-DD HH:mm Z').tz('America/Sao_Paulo'),
            branch: head['ref'],
            number
        }))
        .filter(async function ({id, updated}) {
            const date = await require('./find-latest-review-time')(id);
            return !(date && date.isAfter(updated));
        })
        .map(async function (pull) {
            pull['reviews'] = await require('./list-reviews')(organizationName, repository, pull['number']);
            return pull;
        });
}

module.exports = listPendingPullRequests;