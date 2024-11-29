package com.soa.navigatorspring.service;

import java.util.List;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.consul.discovery.ConsulDiscoveryClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DiscoveryService {

    private final RestTemplate restTemplate;
    private final ConsulDiscoveryClient consulDiscoveryClient;

    public DiscoveryService(
        RestTemplate restTemplate,
        ConsulDiscoveryClient consulDiscoveryClient
    ) {
        this.restTemplate = restTemplate;
        this.consulDiscoveryClient = consulDiscoveryClient;
    }

    public String getCoreHello() {
        List<ServiceInstance> instances = consulDiscoveryClient.getInstances(
            "core-service"
        );
        if (instances.isEmpty()) {
            throw new RuntimeException(
                "No instances of 'core-service' service found in Consul"
            );
        }

        ServiceInstance serviceInstance = instances.get(0);
        String url = serviceInstance.getUri().toString() + "/routes";
        System.out.println(url);
        return url;
    }

    public RestTemplate t() {
        return restTemplate;
    }
}
