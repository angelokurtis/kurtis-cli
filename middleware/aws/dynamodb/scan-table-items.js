'use strict';

const bash = require('../../bash');

async function scanTableItems(tableName) {
    if (!tableName) throw new Error('table name should not be null');

    let cli = tableName.startsWith('development.') ? 'awslocal' : 'aws';
    const {Items} = await bash(`${cli} dynamodb scan --table-name ${tableName}`);
    return Items;
}

module.exports = scanTableItems;