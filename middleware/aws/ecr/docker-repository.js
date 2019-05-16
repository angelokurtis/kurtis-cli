'use strict';

const bash = require('../../bash');

async function dockerRepository(repositoryName) {
    if (!repositoryName) throw new Error('repository name should not be null');

    const {repositories} = await bash(`aws ecr describe-repositories --repository-names ${repositoryName}`);
    return repositories[0];
}

module.exports = dockerRepository;