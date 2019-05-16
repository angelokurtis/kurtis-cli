'use strict';

const bash = require('../../bash');
const util = require('util');
const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);

async function importDynamodbItems(environmentName, tableName) {
    if (!environmentName) throw new Error('environment name should not be null');

    let {TableNames: tables} = await bash('aws dynamodb list-tables');
    tables = _.filter(tables, table => table.startsWith(`${environmentName}.`));
    for (let i = 0; i < tables.length; i++) {
        await scanTableItems(tables[i]);
    }
    return tables;
}

async function scanTableItems(tableName) {
    if (!tableName) throw new Error('table name should not be null');

    const {Items: items} = await bash(`aws dynamodb scan --table-name ${tableName}`);

    for (let i = 0; i < items.length; i++) {
        console.log('# putting table item');
        await putTableItem(tableName, items[i]);
        console.log('# put finalized');
    }
}

async function putTableItem(tableName, item) {
    if (!tableName) throw new Error('table name should not be null');
    if (!item) throw new Error('item should not be null');
    tableName = tableName.split(".")[1];
    return await bash(`awslocal dynamodb put-item --table-name development.${tableName} --item '${JSON.stringify(item)}'`, true);
}

module.exports = importDynamodbItems;