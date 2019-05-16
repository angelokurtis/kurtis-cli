'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));
const axios = require('axios');
const moment = require('moment-timezone');

async function listReviewedPullRequests(organizationName, repository) {
    if (!organizationName) throw new Error('organization name should not be null');
    if (!repository) throw new Error('repository should not be null');

    let token = '';
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
        .map(async function (pull) {
            pull['reviews'] = await require('./list-reviews')(organizationName, repository, pull['number']);
            return pull;
        })
        .filter(async function ({reviews}) {
            const pending = await Aigle.resolve(reviews).filter(({state}) => state !== 'APPROVED');
            return reviews.length > 0 && pending.length === 0;
        });
}

module.exports = listReviewedPullRequests;