'use strict';

const cli = require('caporal');
const path = require('path');
const sh = require('../../../../middleware/bash');
const handle = require('../../../../middleware/output-handler');

async function finish(args, options) {
    try {
        const project = `${path.resolve('./')}/`;
        let {version} = await require('../../../../middleware/maven/get-pom-details')(`${project.replace('/.git', '')}`);
        version = version.replace('-SNAPSHOT', '');
        await run(`git checkout release/v${version}`, true);
        await run(`git push origin refs/heads/release/v${version}:release/v${version} --set-upstream`, true);
        await run(`git flow release finish -m 'Tagging version ${version}' 'v${version}'`, true);
        await run('git checkout master', true);
        await run('git push origin refs/heads/master:master --set-upstream', true);
        await run(`git push origin v${version}`, true);
        await run('git checkout -b release/next', true);
        await sh(`kurtis java-maven-versions-update-to-next`, true);
        const files = await run(`git diff --name-only HEAD`);
        if (files.length > 0) {
            await run(`git commit -m 'Preparing for the next version' -- ${files.join(' ')}`, true);
            await run('git push origin refs/heads/release/next:release/next --set-upstream', true);
        }
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
        .action(finish);
};
