'use strict';

const Aigle = require('aigle');
const _ = require('lodash');
Aigle.mixin(_);

async function organizePom(projectPath) {
    if (!projectPath) throw new Error('project path should not be null');

}


module.exports = organizePom;