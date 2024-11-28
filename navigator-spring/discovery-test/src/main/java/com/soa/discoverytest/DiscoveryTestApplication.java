package com.soa.discoverytest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DiscoveryTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiscoveryTestApplication.class, args);
    }

}
