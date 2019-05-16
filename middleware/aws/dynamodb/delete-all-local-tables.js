'use strict';

const Aigle = require('aigle');

async function deleteAllLocalTables() {
    const tables = await require('./list-tables')('development');
    await Aigle.forEach(tables, async table => await require('./delete-table')(table))
}

module.exports = deleteAllLocalTables;