'use strict';

const FG_BLUE = "\x1b[34m%s\x1b[0m";

const bash = require('../bash');
const _ = require('lodash');

async function clearDanglingImages() {
    const outstanding = await bash(`docker images --filter 'dangling=true' --quiet`, true);
    const builders = await bash(`docker images --filter 'label=builder=true' --quiet`, true);
    const disposables = _.difference(outstanding, builders);
    if (disposables.length > 0) return await clear(disposables);
    return [];
}

async function clear(images) {
    const command = `docker rmi ${images.join(' ')}`;
    try {
        const removed = await bash(command);
        console.log(FG_BLUE, command);
        return removed;
    } catch (e) {
        const {stderr} = e;
        if (!stderr.includes || !stderr.includes('image is being used by stopped container')) throw e;
        await require('./clear-exited-containers')();
        return await bash(command, true);
    }
}
module.exports = clearDanglingImages;