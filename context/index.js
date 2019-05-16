'use strict';

const Profiles = require('./profiles');

module.exports = class AppContext {
    static profiles() {
        return new Profiles();
    }
};