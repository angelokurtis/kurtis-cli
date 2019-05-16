'use strict';

async function addReview(pullRequestId) {
    if (!pullRequestId) throw new Error('pull request id should not be null');

    const db = await require('../../context/database').open();
    await db.run(`INSERT INTO reviews(pull_request_id) VALUES ('${pullRequestId}')`);
    return await db.all(`SELECT * FROM reviews WHERE pull_request_id = '${pullRequestId}'`);
}

module.exports = addReview;