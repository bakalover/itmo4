package com.soa.navigatorspring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@Configuration
public class XsdConfig {

    @Bean
    public XsdSchema navigationSchema() {
        return new SimpleXsdSchema(new ClassPathResource("navigation.xsd"));
    }
}
