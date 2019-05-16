'use strict';

const bash = require('../../bash');

module.exports = () => bash(`aws ecr describe-repositories --query 'repositories' --query 'repositories[].repositoryName'`);