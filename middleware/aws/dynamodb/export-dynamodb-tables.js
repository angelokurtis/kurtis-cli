'use strict';

const bash = require('../../bash');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);
const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

const exclude = [
    'TableSizeBytes',
    'CreationDateTime',
    'ItemCount',
    'TableStatus',
    'TableId',
    'TableArn',
    'NumberOfDecreasesToday',
    'IndexStatus',
    'ItemCount',
    'IndexSizeBytes',
    'NumberOfDecreasesToday',
    'IndexArn'
];

async function exportDynamoDBTables() {
    let {TableNames} = await bash('aws dynamodb list-tables');

    TableNames.forEach(async tableName => await exportDynamodbTables(tableName));
    return TableNames;
}

async function exportDynamodbTables(tableName) {
    if (!tableName) throw new Error('table name should not be null');

    const {Table} = await bash(`aws dynamodb describe-table --table-name ${tableName}`, true);

    excludeKeys(Table);

    const filepath = `${path.resolve('./')}/${tableName}.json`;
    writeFile(filepath, JSON.stringify(Table, null, 2));
    return filepath;
}

function excludeKeys(object) {
    for (let key in object) {
        if (typeof object[key] === 'object' && object[key] !== null) {
            excludeKeys(object[key]);
        } else {
            if (exclude.includes(key)) delete object[key];
        }
    }
}


module.exports = exportDynamoDBTables;