'use strict';

const bash = require('../bash');

async function clearDanglingImages() {
    const ids = await bash(`docker images --filter 'dangling=true' --quiet`, true);
    if (ids.length > 0) return await bash(`docker rmi ${ids.join(' ')}`, true);
    return [];
}

module.exports = clearDanglingImages;