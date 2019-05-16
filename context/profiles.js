'use strict';

const Aigle = require('aigle');
Aigle.mixin(require('lodash'));

module.exports = class Profiles {
    async all() {
        const db = await require('./database').open();
        const profiles = await db.all('SELECT * FROM profiles');
        return await Aigle.map(profiles, ({id, name, active}) => new Profile(id, name, active));
    }

    async names() {
        const db = await require('./database').open();
        return await db.all('SELECT name FROM profiles');
    }

    async get(name) {
        const db = await require('./database').open();
        const profiles = await db.all(`SELECT * FROM profiles WHERE name = '${name}'`);
        return await Aigle.map(profiles, ({id, name, active}) => new Profile(id, name, active)).first();
    }

    async getActive() {
        const db = await require('./database').open();
        const profiles = await db.all(`SELECT * FROM profiles WHERE active = 1`);
        return await Aigle.map(profiles, ({id, name, active}) => new Profile(id, name, active)).first();
    }

    async add(name) {
        const db = await require('./database').open();
        await db.run(`INSERT INTO profiles(name, active) VALUES ('${name}', 1) `);
        await db.run(`UPDATE profiles SET active = 0 WHERE name <> '${name}'`);
    }
};

class Profile {
    constructor(id, name, active) {
        this.id = id;
        this.name = name;
        this.active = Boolean(active);
    }

    async activate() {
        const db = await require('./database').open();
        await db.run(`UPDATE profiles SET active = 1 WHERE name = '${this.name}'`);
        await db.run(`UPDATE profiles SET active = 0 WHERE name <> '${this.name}'`);
        this.active = true;
    }
}