#!/usr/bin/env node

'use strict';

// const httpToCurl = require('http-to-curl').default;
// httpToCurl();

const cli = require('caporal');
const fs = require('fs');
const {version} = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'));
const commandsPath = require('path').join(__dirname, 'commands');

module.exports = async function () {
    cli.version(version);
    fs.readdirSync(commandsPath).forEach(command => require(`./commands/${command}`)(command));
    cli.parse(process.argv);
};
