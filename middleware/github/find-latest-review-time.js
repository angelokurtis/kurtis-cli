'use strict';

const moment = require('moment-timezone');

async function findLatestReviewTime(pullRequestId) {
    if (!pullRequestId) throw new Error('pull request id should not be null');

    const db = await require('../../context/database').open();
    const reviews = await db.all(`SELECT * FROM reviews WHERE pull_request_id = '${pullRequestId}' ORDER BY date DESC LIMIT 1`);
    return reviews.length < 1 ? undefined : moment.utc(reviews[0]['date'], 'YYYY-MM-DD HH:mm:ss"').tz('America/Sao_Paulo');
}

module.exports = findLatestReviewTime;