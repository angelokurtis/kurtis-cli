'use strict';

const bash = require('../bash');

async function findById(id) {
    if (!id) throw new Error('id should not be null');

    return await bash(`docker inspect ${id}`);
}

module.exports = findById;