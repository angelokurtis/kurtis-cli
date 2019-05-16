'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);
const path = require('path');
const FG_BLUE = "\x1b[34m%s\x1b[0m";
const ERROR_PATTERN = "\x1b[31m%s\x1b[0m";

async function deployImage(projectPath) {
    if (!projectPath) throw new Error('project path should not be null');

    const image = await require('./build-image')(projectPath);

    try {
        await bash(`docker push ${image}`, true);
    } catch ({stderr}) {
        console.error(ERROR_PATTERN, 'Command failed. Your Authorization Token has expired.');
        await ecrAuthorize();
        await bash(`docker push ${image}`, true);
    }

    const serviceName = path.basename(projectPath);
    return await require('./clean-old-images')(serviceName);
}

async function ecrAuthorize() {
    const {authorizationData} = await bash('aws ecr get-authorization-token');
    const {authorizationToken: token, proxyEndpoint: endpoint} = authorizationData[0];
    console.log(FG_BLUE, `echo $(aws ecr get-authorization-token --output text --query 'authorizationData[].authorizationToken' | base64 -d | cut -d: -f2) | docker login -u AWS ${endpoint} --password-stdin`);
    await bash(`echo ${token} |  base64 -d | cut -d: -f2 | docker login -u AWS ${endpoint} --password-stdin`);
}

module.exports = deployImage;