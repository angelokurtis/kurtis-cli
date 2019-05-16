'use strict';

const changeCase = require('change-case');
const sh = require('../bash');

async function generateLibraryScaffolding(projectName) {
    if (!projectName) throw new Error('project name should not be null');

    const project = changeCase.kebabCase(projectName);
    const packageName = changeCase.snakeCase(projectName);
    const className = changeCase.pascalCase(projectName);
    const applicationName = changeCase.titleCase(projectName);

    //<editor-fold desc="pom.xml">
    const POM_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>br.com.kurtis</groupId>
  <artifactId>${project}</artifactId>
  <version>1.0.0-SNAPSHOT</version>

  <properties>
    <java.version>1.8</java.version>

    <exec-maven-plugin.version>1.6.0</exec-maven-plugin.version>
    <junit-jupiter.version>5.3.2</junit-jupiter.version>
    <maven-compiler-plugin.version>3.8.0</maven-compiler-plugin.version>
    <maven-shade-plugin.version>3.2.1</maven-shade-plugin.version>
    <maven-surefire-plugin.version>2.22.1</maven-surefire-plugin.version>

    <assertj.version>3.12.0</assertj.version>
    <junit-platform-launcher.version>1.4.0</junit-platform-launcher.version>
    <log4j.version>2.11.2</log4j.version>
    <vertx.version>3.6.3</vertx.version>

    <main.verticle>br.com.kurtis.${packageName}.${className}Verticle</main.verticle>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>io.vertx</groupId>
        <artifactId>vertx-stack-depchain</artifactId>
        <version>\${vertx.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-core</artifactId>
      <version>\${vertx.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.logging.log4j</groupId>
      <artifactId>log4j-core</artifactId>
      <version>\${log4j.version}</version>
    </dependency>
    <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-web-client</artifactId>
      <version>\${vertx.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.vertx</groupId>
      <artifactId>vertx-junit5</artifactId>
      <version>\${vertx.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.junit.platform</groupId>
      <artifactId>junit-platform-launcher</artifactId>
      <version>\${junit-platform-launcher.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.assertj</groupId>
      <artifactId>assertj-core</artifactId>
      <version>\${assertj.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>\${maven-compiler-plugin.version}</version>
          <configuration>
            <source>\${java.version}</source>
            <target>\${java.version}</target>
          </configuration>
        </plugin>
      </plugins>
    </pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>\${maven-shade-plugin.version}</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <manifestEntries>
                    <Main-Class>io.vertx.core.Launcher</Main-Class>
                    <Main-Verticle>\${main.verticle}</Main-Verticle>
                  </manifestEntries>
                </transformer>
                <transformer implementation="org.apache.maven.plugins.shade.resource.AppendingTransformer">
                  <resource>META-INF/services/io.vertx.core.spi.VerticleFactory</resource>
                </transformer>
              </transformers>
              <artifactSet>
              </artifactSet>
              <outputFile>\${project.build.directory}/\${project.artifactId}-\${project.version}-fat.jar</outputFile>
            </configuration>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>\${maven-surefire-plugin.version}</version>
        <dependencies>
          <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>\${junit-jupiter.version}</version>
          </dependency>
        </dependencies>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>\${exec-maven-plugin.version}</version>
        <configuration>
          <mainClass>io.vertx.core.Launcher</mainClass>
          <arguments>
            <argument>run</argument>
            <argument>\${main.verticle}</argument>
          </arguments>
        </configuration>
      </plugin>
    </plugins>
  </build>

</project>`;
    //</editor-fold>
    //<editor-fold desc="main class">
    const CLASS_TEMPLATE = `package br.com.kurtis.${packageName};

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;

public class ${className}Verticle extends AbstractVerticle {

  private static final int DEFAULT_PORT = 8080;

  @Override
  public void start(final Future<Void> bootstrap) {
    final Integer httpPort = this.config().getInteger("http.port", DEFAULT_PORT);
    this.vertx
        .createHttpServer()
        .requestHandler(request -> request.response().end("<h1>${applicationName} Vert.x 3 Application</h1>"))
        .listen(httpPort, result -> {
          if (result.succeeded()) bootstrap.complete();
          else bootstrap.fail(result.cause());
        });
  }
}`;
    //</editor-fold>
    //<editor-fold desc="test class">
    const TEST_CLASS_TEMPLATE = `package br.com.kurtis.${packageName};

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.HttpResponse;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;
import io.vertx.junit5.Timeout;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.io.IOException;
import java.net.ServerSocket;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Java6Assertions.assertThat;

@ExtendWith(VertxExtension.class)
public class ${className}VerticleTest {

  private int port;

  @BeforeEach
  void deployVerticle(final Vertx vertx, final VertxTestContext context) throws IOException {
    try (final ServerSocket socket = new ServerSocket(0)) {
      this.port = socket.getLocalPort();
    }
    final DeploymentOptions options = new DeploymentOptions().setConfig(new JsonObject().put("http.port", this.port));
    vertx.deployVerticle(new ${className}Verticle(), options, context.succeeding(id -> context.completeNow()));
  }

  @Test
  @DisplayName("Should start a Web Server")
  @Timeout(value = 10, timeUnit = TimeUnit.SECONDS)
  void testHttpServer(final Vertx vertx, final VertxTestContext context) {
    WebClient.create(vertx)
        .get(this.port, "localhost", "/")
        .as(BodyCodec.string())
        .send(event -> {
          assertThat(event.succeeded()).isTrue();
          final HttpResponse<String> response = event.result();
          assertThat(response.body()).contains("Vert.x 3 Application");
          context.completeNow();
        });
  }
}`;
    //</editor-fold>
    //<editor-fold desc="config">
    const CONF_TEMPLATE = `{
  "http.port": 8082
}`;
    //</editor-fold>
    //<editor-fold desc="log file">
    const LOG_FILE_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
  <Properties>
    <Property name="LOG_LEVEL_PATTERN">%5p</Property>
    <Property name="LOG_DATEFORMAT_PATTERN">yyyy-MM-dd HH:mm:ss.SSS</Property>
    <Property name="CONSOLE_LOG_PATTERN">%d{\${LOG_DATEFORMAT_PATTERN}} %highlight{\${LOG_LEVEL_PATTERN}} --- [%t] %style{%c}{cyan} : %style{%m%n}{black}%style{%throwable}{red}</Property>
  </Properties>
  <Appenders>
    <Console name="Console" target="SYSTEM_OUT" follow="true">
      <PatternLayout pattern="\${sys:CONSOLE_LOG_PATTERN}"/>
    </Console>
  </Appenders>
  <Loggers>
    <Logger name="io.vertx" level="debug"/>
    <Logger name="br.com.kurtis.${packageName}" level="trace"/>
    <Root level="warn">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>`;
    //</editor-fold>

    await sh(`mkdir -p ./${project}/src/test/java/br/com/kurtis/${packageName}`);
    await sh(`mkdir -p ./${project}/src/main/java/br/com/kurtis/${packageName}`);
    await sh(`mkdir -p ./${project}/src/main/java/br/com/kurtis/${packageName}`);
    await sh(`mkdir -p ./${project}/src/main/resources`);
    await sh(`echo '${LOG_FILE_TEMPLATE}' > ./${project}/src/main/resources/log4j2.xml`);
    await sh(`echo '${POM_TEMPLATE}' > ./${project}/pom.xml`);
    await sh(`echo '${CLASS_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/${className}Verticle.java`);
    await sh(`echo '${TEST_CLASS_TEMPLATE}' > ./${project}/src/test/java/br/com/kurtis/${packageName}/${className}VerticleTest.java`);
    await sh(`echo '${CONF_TEMPLATE}' > ./${project}/config.json`);

    return {project};
}

module.exports = generateLibraryScaffolding;

