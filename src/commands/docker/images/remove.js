'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const inquirer = require('inquirer');

async function remove(args) {
    try {
        const images = await require('../../../../middleware/docker/rm-images')();
        handle.success(images);
    } catch (e) {
        console.log(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, 'Delete a bunch of Docker images by prefix')
        .option('--prefix <docker-image-prefix>', 'The prefix of Docker images to be deleted', cli.STRING)
        .action(remove);
};
