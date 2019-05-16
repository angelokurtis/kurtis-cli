'use strict';

const path = require('path');
const readFile = require('util').promisify(require('fs').readFile);
const parser = require('xml2json');

async function getPomDetails(projectPath) {
    if (!projectPath) throw new Error('project path should not be null');
    const pomPath = path.normalize(`${projectPath}/pom.xml`);
    const pomXml = await readFile(pomPath);
    const {project} = JSON.parse(parser.toJson(pomXml));
    const {groupId, artifactId, version} = project;

    return {path: pomPath, groupId, artifactId, version};
}

module.exports = getPomDetails;