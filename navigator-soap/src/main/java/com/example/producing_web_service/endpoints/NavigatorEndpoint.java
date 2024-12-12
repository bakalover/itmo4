package com.example.producing_web_service.endpoints;

import com.service.navigator.HelloResponse;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.service.navigator.HelloRequest;


@Endpoint
public class NavigatorEndpoint {
    private static final String NAMESPACE_URI = "http://navigator.service.com";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "helloRequest")
    @ResponsePayload
    public HelloResponse getHello(@RequestPayload HelloRequest helloRequest){
        HelloResponse response = new HelloResponse();
        response.setMessage("Hello World");
        return response;
    }

}
