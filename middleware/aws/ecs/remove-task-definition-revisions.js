'use strict';

const bash = require('../../bash');
const Aigle = require('aigle');

function removeTaskDefinitionRevisions(revisions) {
    if (!revisions || revisions.length === 0) throw new Error('revisions should not be null or empty');

    return Aigle.resolve(revisions).forEach(removeTaskDefinitionRevision);
}

function removeTaskDefinitionRevision(revision) {
    if (!revision) throw new Error('revision should not be null');

    return bash(`aws ecs deregister-task-definition --task-definition ${revision}`, true);
}

module.exports = removeTaskDefinitionRevisions;