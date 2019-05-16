'use strict';

const bash = require('../../bash');

async function getRepository(serviceName) {
    if (!serviceName) throw new Error('service name should not be null');

    const {repositories} = await bash(`aws ecr describe-repositories --repository-names ${serviceName}`);
    return repositories[0];
}

module.exports = getRepository;