'use strict';

const bash = require('../../bash');
const path = require('path');
const parser = require('xml2json');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

async function buildImage(projectPath) {
    if (!projectPath) throw new Error('project path should not be null');
    projectPath = path.normalize(`${projectPath}/pom.xml`);

    const pomXml = await readFile(projectPath);
    const {project} = JSON.parse(parser.toJson(pomXml));

    const output = await bash(`mvn clean install docker:build -f ${projectPath} -Dmaven.test.skip=true`, true);
    const dockerImage = await imageNameFromMavenOutput(output);
    const tag = dockerImage.split(':')[1];

    const serviceName = project.artifactId;
    if (!await repositoryExists(serviceName)) await require('./create-repository')(serviceName);
    const {repositoryUri} = await require('./get-repository')(serviceName);
    const ecrImage = `${repositoryUri}:${tag}`;
    await bash(`docker tag ${dockerImage} ${ecrImage}`, true);
    return ecrImage;
}

async function imageNameFromMavenOutput(mavenOutput) {
    return await Aigle
        .filter(mavenOutput.match(/[^\r\n]+/g), line => line.startsWith('[INFO] DOCKER> '))
        .map(line => line.match(/\[.*?]/g)[1])
        .map(line => line.replace('[', '').replace(']', ''))
        .first();
}

async function repositoryExists(serviceName) {
    const {repositories} = await bash(`aws ecr describe-repositories`);
    return await Aigle
        .map(repositories, repository => repository.repositoryName)
        .includes(serviceName);
}

module.exports = buildImage;