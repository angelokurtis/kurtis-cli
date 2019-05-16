'use strict';

const bash = require('../../bash');

module.exports = () => bash("aws ecs list-task-definition-families --query 'families'");