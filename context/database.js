const sqlite = require('sqlite');

exports.open = async function open() {
    const db = await sqlite.open(`${__dirname}/../aws.db`, {Promise});
    // await db.migrate({force: 'last'});
    return db;
};