package com.soa.navigatorspring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DiscoveryService {
    private final RestTemplate restTemplate;

    @Autowired
    public DiscoveryService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getCoreData() {
        // The URL uses the service name registered in Consul
        return restTemplate.getForObject("http://discovery-test/test", String.class);
    }
}
