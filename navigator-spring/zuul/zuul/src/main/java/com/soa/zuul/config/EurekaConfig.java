package com.soa.zuul.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// eureka.client.serviceUrl.defaultZone=${EUREKA_URI:http://localhost:8761/eureka}
@Configuration
@ConfigurationProperties(prefix = "eureka.client.service-url")
public class EurekaConfig {

    private String defaultZone;
}
