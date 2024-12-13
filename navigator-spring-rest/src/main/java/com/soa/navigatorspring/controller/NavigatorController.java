// src/main/java/com/soa/navigator/controller/NavigatorResource.java
package com.soa.navigatorspring.controller;

import com.soa.navigatorspring.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.core.WebServiceTemplate;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/")
public class NavigatorController {

    static String navigatorUrl = "http://localhost:8080/ws";

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello");
    }

    @GetMapping("/routes/{id-from}/{id-to}/{order-by}")
    public ResponseEntity<?> getAllRoutesBetweenLocations(
            @PathVariable("id-from") Long idFrom,
            @PathVariable("id-to") Long idTo,
            @PathVariable("order-by") String orderBy
    ) {

        WebServiceTemplate webTemplate = new WebServiceTemplate();
        var marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("com.service.navigator");
        webTemplate.setMarshaller(marshaller);
        webTemplate.setUnmarshaller(marshaller);

        GetAllRoutesBetweenLocationsRequest request = new GetAllRoutesBetweenLocationsRequest();
        request.setIdFrom(idFrom);
        request.setIdTo(idTo);
        request.setOrderBy(orderBy);

        var soapResp = (GetAllRoutesBetweenLocationsResponse) webTemplate.marshalSendAndReceive(
                navigatorUrl,
                request
        );

        List<Route> routes = soapResp.getRoutes();
        String status = soapResp.getStatus();
        String message = soapResp.getMessage();

        if (Objects.equals(status, "200")) {
            return ResponseEntity.ok(routes);
        } else {
            return ResponseEntity.status(Integer.parseInt(status)).body(
                    message
            );
        }
    }

    @PostMapping("/route/add/{id-from}/{id-to}/{distance}")
    public ResponseEntity<String> addRouteBetweenLocations(
            @PathVariable("id-from") Long idFrom,
            @PathVariable("id-to") Long idTo,
            @PathVariable("distance") Integer distance
    ) {
        AddRouteBetweenLocationsRequest request = new AddRouteBetweenLocationsRequest();
        request.setIdFrom(idFrom);
        request.setIdTo(idTo);
        request.setDistance(distance);

        WebServiceTemplate webTemplate = new WebServiceTemplate();
        var marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("com.service.navigator");
        webTemplate.setMarshaller(marshaller);
        webTemplate.setUnmarshaller(marshaller);

        var soapResp = (AddRouteBetweenLocationsResponse) webTemplate.marshalSendAndReceive(
                navigatorUrl,
                request
        );

        String status = soapResp.getStatus();
        String message = soapResp.getMessage();

        return ResponseEntity.status(Integer.parseInt(status)).body(message);

    }

}
