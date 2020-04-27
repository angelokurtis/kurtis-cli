'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');
const os = require('os');
const yaml = require('js-yaml');
const AppContext = require('../../context');

const FG_BLUE = "\x1b[34m%s\x1b[0m";
const BG_GREEN = "\x1b[42m%s\x1b[0m";
const LIGHT_CYAN = "\x1b[96m%s\x1b[0m";


async function bash(command, debug, dryRun) {
    if (typeof command === 'object') {
        let {cmd, dir} = command;
        cmd = await setProfileIfAwsCommand(cmd);
        if (debug) console.log(LIGHT_CYAN, cmd);
        if (!dryRun) {
            return await run(`cd ${dir} && ${cmd}`)
        } else return {};
    } else {
        command = await setProfileIfAwsCommand(command);
        if (debug) console.log(LIGHT_CYAN, command);
        if (!dryRun) {
            return await run(command)
        } else return {};
    }
}

async function setProfileIfAwsCommand(command) {
    command = command.trim();
    if (command.startsWith('aws ') && !command.includes('--profile')) {
        const profiles = AppContext.profiles();
        const {name} = await profiles.getActive();
        command = `${command} --profile '${name}'`;
    } else if (command.startsWith('ecs-cli ')) {
        const profiles = AppContext.profiles();
        const {name} = await profiles.getActive();
        const accessKeyId = (await run(`aws configure get ${name}.aws_access_key_id`))[0];
        const secretAccessKey = (await run(`aws configure get ${name}.aws_secret_access_key`))[0];

        await run(`ecs-cli configure profile --profile-name '${name}' --access-key '${accessKeyId}' --secret-key '${secretAccessKey}'`, {maxBuffer: 1024 * 50000});
    }
    return command;
}

function ifObjectGetJSON(string) {
    try {
        const object = JSON.parse(string);
        if (object && typeof object === 'object') return object;
    } catch (e) {
    }
    const out = string.split(os.EOL);
    return out.length === 1 ? out[0] : _.filter(out, line => line && line.trim().length > 0)
}

async function run(command) {
    const {stdout, stderr} = await exec(command, {maxBuffer: 1024 * 50000});
    if (stderr) throw stderr;
    return ifObjectGetJSON(stdout);
}

module.exports = bash;
