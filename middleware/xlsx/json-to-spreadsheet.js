'use strict';

const XLSX = require('xlsx');
const Aigle = require('aigle');

async function jsonToSpreadsheet(json, filename) {
    if (!json) throw new Error('JSON should not be null');
    filename = filename || `spreadsheet-${new Date().getMilliseconds()}`;
    json = Array.isArray(json) ? json : [json];
    const columns = await Aigle.resolve(json).forEach(transform);

    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(columns);
    XLSX.utils.book_append_sheet(wb, sheet, filename);
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

async function transform(line) {
    for (let column in line) {
        if (line.hasOwnProperty(column)) {
            if (Array.isArray(line[column])) {
                line[column] = (await Aigle.resolve(line[column])
                    .map(function (element) {
                        let result = element;
                        result = Array.isArray(result) ? '[ ... ]' : result;
                        result = typeof result === 'object' ? '{ ... }' : result;
                        return result;
                    })).join('; ');
            } else if (typeof line[column] === 'object') {
                line[column] = '{ ... }';
            }
        }
    }
}

module.exports = jsonToSpreadsheet;