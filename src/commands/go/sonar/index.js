'use strict';

const fs = require('fs');
const commandsPath = require('path').join(__dirname, './');

module.exports = function (prefix) {
    fs.readdirSync(commandsPath).forEach(command => {
        if (command !== 'index.js')
            require('./' + command)(`${prefix}-${command.replace('.js', '')}`);
    });
};
