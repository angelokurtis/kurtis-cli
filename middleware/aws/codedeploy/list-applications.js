'use strict';

const sh = require('../../bash');
const Aigle = require('aigle');

async function listApplications() {
    const {applications} = await sh('aws deploy list-applications');
    return await Aigle.resolve(applications).map(require('./get-application'));
}

module.exports = listApplications;