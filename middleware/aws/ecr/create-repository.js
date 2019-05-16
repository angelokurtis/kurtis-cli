'use strict';

const bash = require('../../bash');

async function createRepository(serviceName) {
    if (!serviceName) throw new Error('service name should not be null');

    return await bash(`aws ecr create-repository --repository-name ${serviceName}`, true);
}

module.exports = createRepository;