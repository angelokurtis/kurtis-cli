'use strict';

const cli = require('caporal');
const handle = require('../../../../middleware/output-handler');
const sh = require('../../../../middleware/bash');
const path = require('path');
const changeCase = require('change-case');

async function scan(args, {projectPath}) {
    projectPath = projectPath || '.';
    projectPath = `${path.resolve(projectPath)}/`;
    const packageName = changeCase.snakeCase(path.basename(projectPath));
    await sh(`cat > ${projectPath}sonar-project.properties <<EOF
sonar.projectKey=${packageName}
sonar.projectName=${packageName}
sonar.projectVersion=1.0.0
sonar.host.url=http://localhost:9000
sonar.working.directory=/home/tangelo/dev/projects/gocode-analysis/${packageName}
sonar.login=admin
sonar.password=admin

sonar.sources=.
sonar.exclusions=**/*_test.go,**/vendor/**,**/testdata/*

sonar.tests=.
sonar.test.inclusions=**/*_test.go
sonar.test.exclusions=**/vendor/**
sonar.go.coverage.reportPaths=bin/cov.out

EOF`);

    await sh(`go test -short -coverprofile=${projectPath}bin/cov.out`, true);
    await sh(`docker run --rm --network host --mount type=volume,src="${projectPath}",dst=/opt/app,type=bind -w=/opt/app red6/docker-sonar-scanner:latest sonar-scanner`, true);
    await sh(`rm ${projectPath}sonar-project.properties ${projectPath}bin/cov.out`, true);
    try {
        handle.success(packageName)
    } catch (e) {
        handle.error(e);
    }
}

module.exports = function (command) {
    cli
        .command(command, '')
        .option('-p, --project-path <project-path>', '', cli.STRING)
        .action(scan);
};
