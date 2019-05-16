'use strict';

const cli = require('caporal');
const path = require('path');
const sh = require('../../../../middleware/bash');
const handle = require('../../../../middleware/output-handler');

async function init(args, options) {
    try {
        const project = `${path.resolve('./')}/`;
        try {
            await run('git flow init -f -d', true);
        } catch (e) {
            if (!e.includes || !e.includes('Local branch \'master\' does not exist.')) throw e;
            await run('git checkout -b master', true);
            await run('git flow init -f -d', true);
        }
        const currentBranch = (await run(`git rev-parse --abbrev-ref HEAD`))[0];
        if (currentBranch !== 'develop') {
            await run('git checkout develop', true);
        }
        await run('git pull', true);
        let {version} = await require('../../../../middleware/maven/get-pom-details')(`${project.replace('/.git', '')}`);
        version = version.replace('-SNAPSHOT', '');
        try {
            await run(`git flow release start v${version}`, true);
        } catch (e) {
            if (e.startsWith('Fatal: There is an existing release branch')) {
                await run(`git branch -D release/v${version}`, true);
                await run(`git flow release start v${version}`, true);
            } else if (e.includes(`Tag 'v${version}' already exists.`)) {
                await run(`git tag -d v${version}`, true);
                await run(`git flow release start v${version}`, true);
            } else throw e;
        }
        await sh(`kurtis java-maven-versions-update-to-release`, true);
        const files = await run(`git diff --name-only HEAD`);
        if (files.length > 0) await run(`git commit -m 'Releasing version ${version}' -- ${files.join(' ')}`, true);
    } catch (e) {
        handle.error(e);
    }
}

async function run(command, debug) {
    try {
        return await sh(command, debug);
    } catch ({stderr}) {
        if (stderr) throw stderr;
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .action(init);
};
