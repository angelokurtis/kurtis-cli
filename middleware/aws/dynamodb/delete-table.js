'use strict';

const bash = require('../../bash');

async function deleteTable(tableName) {
    if (!tableName) throw new Error('table name should not be null');

    let cli = tableName.startsWith('development.') ? 'awslocal' : 'aws';
    const {Items} = await bash(`${cli} dynamodb delete-table --table-name ${tableName}`, true);
    return Items;
}

module.exports = deleteTable;