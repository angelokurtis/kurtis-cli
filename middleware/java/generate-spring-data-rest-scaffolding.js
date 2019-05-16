'use strict';

const changeCase = require('change-case');
const sh = require('../bash');

async function generateSpringDataRestScaffolding(projectName) {
    if (!projectName) throw new Error('project name should not be null');

    const project = changeCase.kebabCase(projectName);
    const packageName = changeCase.snakeCase(projectName);
    const className = changeCase.pascalCase(projectName);
    const applicationName = changeCase.titleCase(projectName);


    //<editor-fold desc="pom.xml">
    const POM_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.kurtis</groupId>
    <artifactId>${project}</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>${applicationName}</name>
    <description>Restful API project for ${applicationName}</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.0.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <asciidoctor-plugin.version>1.5.6</asciidoctor-plugin.version>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <snippetsDirectory>\${project.build.directory}/generated-snippets</snippetsDirectory>
        <fabric8-docker-plugin.version>0.26.0</fabric8-docker-plugin.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-rest</artifactId>
        </dependency>

        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.restdocs</groupId>
            <artifactId>spring-restdocs-mockmvc</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.asciidoctor</groupId>
                <artifactId>asciidoctor-maven-plugin</artifactId>
                <version>\${asciidoctor-plugin.version}</version>
                <executions>
                    <execution>
                        <id>generate-docs</id>
                        <phase>package</phase>
                        <goals>
                            <goal>process-asciidoc</goal>
                        </goals>
                        <configuration>
                            <backend>html</backend>
                            <doctype>book</doctype>
                            <attributes>
                                <snippets>\${snippetsDirectory}</snippets>
                            </attributes>
                            <sourceDirectory>src/docs/asciidocs</sourceDirectory>
                            <outputDirectory>target/generated-docs</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>io.fabric8</groupId>
                <artifactId>docker-maven-plugin</artifactId>
                <version>\${fabric8-docker-plugin.version}</version>
                <configuration>
                    <images>
                        <image>
                            <name>kurtis/\${project.artifactId}</name>
                            <build>
                                <from>openjdk:8-jre-alpine3.7</from>
                                <entryPoint>java -jar /application/\${project.build.finalName}.jar</entryPoint>
                                <assembly>
                                    <basedir>/application</basedir>
                                    <descriptorRef>artifact</descriptorRef>
                                    <inline>
                                        <id>assembly</id>
                                        <files>
                                            <file>
                                                <source>target/\${project.build.finalName}.jar</source>
                                            </file>
                                        </files>
                                    </inline>
                                </assembly>
                                <tags>
                                    <tag>latest</tag>
                                    <tag>\${project.version}</tag>
                                </tags>
                                <ports>
                                    <port>9090</port>
                                </ports>
                            </build>
                            <run>
                                <namingStrategy>alias</namingStrategy>
                            </run>
                            <alias>\${project.build.finalName}
                            </alias>
                        </image>
                    </images>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>`;
    //</editor-fold>

    //<editor-fold desc="database utils">
    const INIT_TEMPLATE = `package br.com.kurtis.${packageName}.infra.database.init;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class Initializer implements ApplicationRunner {

  @Override
  public void run(final ApplicationArguments args) {
  }
}`;
    const LOCAL_DATE_CONVERTER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.database;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Converter(autoApply = true)
public class LocalDateConverter implements AttributeConverter<LocalDate, Timestamp> {

  @Override
  public Timestamp convertToDatabaseColumn(final LocalDate localDate) {
    return Optional.ofNullable(localDate)
        .map(LocalDate::atStartOfDay)
        .map(Timestamp::valueOf)
        .orElse(null);
  }

  @Override
  public LocalDate convertToEntityAttribute(final Timestamp timestamp) {
    return Optional.ofNullable(timestamp)
        .map(Timestamp::toLocalDateTime)
        .map(LocalDateTime::toLocalDate)
        .orElse(null);
  }
}`;

    const LOCAL_DATE_TIME_CONVERTER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.database;;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Converter(autoApply = true)
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, Timestamp> {

  @Override
  public Timestamp convertToDatabaseColumn(final LocalDateTime localDateTime) {
    return Optional.ofNullable(localDateTime)
        .map(Timestamp::valueOf)
        .orElse(null);
  }

  @Override
  public LocalDateTime convertToEntityAttribute(final Timestamp timestamp) {
    return Optional.ofNullable(timestamp)
        .map(Timestamp::toLocalDateTime)
        .orElse(null);
  }
}`;
    //</editor-fold>

    //<editor-fold desc="rest utils">
    const API_REST_CONFIGURATION_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class ApiRestConfiguration extends RepositoryRestConfigurerAdapter {

  @Override
  public void configureRepositoryRestConfiguration(final RepositoryRestConfiguration config) {
    config.getMetadataConfiguration().setAlpsEnabled(false);
  }
}`;


    const JSON_CONFIGURATION_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static com.fasterxml.jackson.databind.PropertyNamingStrategy.SNAKE_CASE;

@Configuration
public class JsonConfiguration {

  @Bean
  public Jackson2ObjectMapperBuilderCustomizer addCustomBigDecimalDeserialization() {
    return builder -> {
      builder.propertyNamingStrategy(SNAKE_CASE);
      builder.featuresToDisable(FAIL_ON_UNKNOWN_PROPERTIES);
    };
  }
}`;

    const LOCAL_DATE_DESERIALIZER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;

public class LocalDateDeserializer extends JsonDeserializer<LocalDate> {

  @Override
  public LocalDate deserialize(final JsonParser p, final DeserializationContext ctxt) throws IOException, JsonProcessingException {
    return LocalDate.parse(p.getText());
  }
}`;

    const LOCAL_DATE_SERIALIZER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDate;

public class LocalDateSerializer extends JsonSerializer<LocalDate> {

  @Override
  public void serialize(final LocalDate value, final JsonGenerator gen, final SerializerProvider serializers) throws IOException, JsonProcessingException {
    gen.writeString(value.toString());
  }
}`

    const LOCAL_DATE_TIME_DESERIALIZER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;

public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

  @Override
  public LocalDateTime deserialize(final JsonParser p, final DeserializationContext ctxt) throws IOException, JsonProcessingException {
    return LocalDateTime.parse(p.getText());
  }
}`;

    const LOCAL_DATE_TIME_SERIALIZER_TEMPLATE = `package br.com.kurtis.${packageName}.infra.rest;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDateTime;

public class LocalDateTimeSerializer extends JsonSerializer<LocalDateTime> {

  @Override
  public void serialize(final LocalDateTime value, final JsonGenerator gen, final SerializerProvider serializers) throws IOException, JsonProcessingException {
    gen.writeString(value.toString());
  }
}`;
    //</editor-fold>

    //<editor-fold desc="main class">
    const MAIN_CLASS_TEMPLATE = `package br.com.kurtis.${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${className}Application {

    public static void main(final String[] args) {
        SpringApplication.run(${className}Application.class, args);
    }
}`;
    //</editor-fold>

    await sh(`mkdir -p ./${project}/src/main/java/br/com/kurtis/${packageName}/domain`);
    await sh(`mkdir -p ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/database/init`);
    await sh(`mkdir -p ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest`);
    await sh(`echo '${POM_TEMPLATE}' > ./${project}/pom.xml`);
    await sh(`echo '${MAIN_CLASS_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/${className}Application.java`);
    await sh(`echo '${INIT_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/database/init/Initializer.java`);
    await sh(`echo '${LOCAL_DATE_CONVERTER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/database/LocalDateConverter.java`);
    await sh(`echo '${LOCAL_DATE_TIME_CONVERTER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/database/LocalDateTimeConverter.java`);
    await sh(`echo '${API_REST_CONFIGURATION_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/ApiRestConfiguration.java`);
    await sh(`echo '${JSON_CONFIGURATION_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/JsonConfiguration.java`);
    await sh(`echo '${LOCAL_DATE_DESERIALIZER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/LocalDateDeserializer.java`);
    await sh(`echo '${LOCAL_DATE_SERIALIZER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/LocalDateSerializer.java`);
    await sh(`echo '${LOCAL_DATE_TIME_DESERIALIZER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/LocalDateTimeDeserializer.java`);
    await sh(`echo '${LOCAL_DATE_TIME_SERIALIZER_TEMPLATE}' > ./${project}/src/main/java/br/com/kurtis/${packageName}/infra/rest/LocalDateTimeSerializer.java`);
    return {project};
}

module.exports = generateSpringDataRestScaffolding;

