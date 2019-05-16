'use strict';

const bash = require('../bash');

async function clearExitedContainers() {
    const ids = await bash(`docker ps --all --filter 'status=exited' --quiet`, true);
    if (ids.length > 0) return await bash(`docker rm ${ids.join(' ')}`, true);
    return [];
}

module.exports = clearExitedContainers;