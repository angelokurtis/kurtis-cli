'use strict';

const cli = require('caporal');
const handle = require('../../../../../middleware/output-handler');
const Aigle = require('aigle');
const inquirer = require('inquirer');
const sh = require('../../../../../middleware/bash');

async function updateToNext(args, {projectPath}) {
    try {
        const projects = await require('../../../../../middleware/maven/list-maven-projects')(projectPath);
        await Aigle
            .resolve(projects)
            .map(require('../../../../../middleware/maven/get-pom-details'))
            .filter(({version}) => !version.endsWith('-SNAPSHOT'))
            .map(project => {
                const splittedVersion = project['version'].split('.');
                project['version'] = `${splittedVersion[0]}.${parseInt(splittedVersion[1]) + 1}.0-SNAPSHOT`;
                return project;
            })
            .forEach(({path, version}) => sh(`mvn versions:set -DnewVersion=${version} -f ${path}`, true));
        // handle.success(a);
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Update the pom.xml release')
        .option('--project-path <maven-project-path>', 'The Maven project path where the pom.xml file is', cli.STRING)
        .action(updateToNext);
};
