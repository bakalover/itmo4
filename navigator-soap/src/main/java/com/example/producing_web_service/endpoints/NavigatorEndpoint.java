package com.example.producing_web_service.endpoints;

import com.service.navigator.AddRouteBetweenLocationsRequest;
import com.service.navigator.AddRouteBetweenLocationsResponse;
import com.service.navigator.GetAllRoutesBetweenLocationsRequest;
import com.service.navigator.GetAllRoutesBetweenLocationsResponse;
import com.service.navigator.GetAllRoutesRequest;
import com.service.navigator.GetAllRoutesResponse;
import com.service.navigator.HelloRequest;
import com.service.navigator.HelloResponse;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.WebServiceTransportException;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
public class NavigatorEndpoint {

    private final String NAMESPACE_URI = "http://navigator.service.com";
    private final String CORE_MULE_URL = "http://localhost:39080/mule/routes";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "helloRequest")
    @ResponsePayload
    public HelloResponse getHello(@RequestPayload HelloRequest helloRequest) {
        HelloResponse response = new HelloResponse();
        response.setMessage("Hello World");
        return response;
    }

    @PayloadRoot(
        namespace = NAMESPACE_URI,
        localPart = "getAllRoutesBetweenLocationsRequest"
    )
    @ResponsePayload
    public GetAllRoutesBetweenLocationsResponse getAllRoutesBetweenLocations(
        @RequestPayload GetAllRoutesBetweenLocationsRequest request
    ) {
        GetAllRoutesBetweenLocationsResponse response =
            new GetAllRoutesBetweenLocationsResponse();

        String filterString =
            "?filter=from.id_eq_" +
            request.getIdFrom() +
            ",to.id_eq_" +
            request.getIdTo();
        String sortString = "&sort=" + request.getOrderBy();

        try {
            WebServiceTemplate webTemplate = new WebServiceTemplate();
            var marshaller = new Jaxb2Marshaller();
            marshaller.setContextPath("com.service.navigator");
            webTemplate.setMarshaller(marshaller);
            webTemplate.setUnmarshaller(marshaller);
            var getAllRoutesResponse =
                (GetAllRoutesResponse) webTemplate.marshalSendAndReceive(
                    CORE_MULE_URL + filterString + sortString,
                    new GetAllRoutesRequest()
                );
            response.setRoutes(getAllRoutesResponse.getGetStat().getRoutes());
        } catch (WebServiceTransportException e) {
            e.printStackTrace();
            response.setMessage(e.getMessage());
        }
        return response;
    }

    @PayloadRoot(
        namespace = NAMESPACE_URI,
        localPart = "addRouteBetweenLocationsRequest"
    )
    @ResponsePayload
    public AddRouteBetweenLocationsResponse addRouteBetweenLocations(
        @RequestPayload AddRouteBetweenLocationsRequest request
    ) {
        AddRouteBetweenLocationsResponse response =
            new AddRouteBetweenLocationsResponse();

        //        if (request.getIdFrom() < 1) {
        //            response.setStatus("BAD_REQUEST");
        //            response.setMessage("id of start location (from) must be positive");
        //            return response;
        //        }
        //        if (request.getIdTo() < 1) {
        //            response.setStatus("BAD_REQUEST");
        //            response.setMessage("id of finish location (to) must be positive");
        //            return response;
        //        }
        //        if (request.getDistance() <= 1) {
        //            response.setStatus("BAD_REQUEST");
        //            response.setMessage("distance must be greater than 1");
        //            return response;
        //        }
        //
        //        try {
        //            Location locationFrom = findLocationById(request.getIdFrom());
        //            if (locationFrom == null) {
        //                response.setStatus("BAD_REQUEST");
        //                response.setMessage("Could not find location with id = " + request.getIdFrom());
        //                return response;
        //            }
        //
        //            Location locationTo = findLocationById(request.getIdTo());
        //            if (locationTo == null) {
        //                response.setStatus("BAD_REQUEST");
        //                response.setMessage("Could not find location with id = " + request.getIdTo());
        //                return response;
        //            }
        //
        //            Route route = new Route();
        //            route.setName(
        //                    "from_" +
        //                            locationFrom.getName() +
        //                            "_to_" +
        //                            locationTo.getName() +
        //                            "_distance_" +
        //                            request.getDistance()
        //            );
        //            Coordinates cc = new Coordinates();
        //            cc.setX(0);
        //            cc.setY(0);
        //            route.setCoordinates(cc);
        //            route.setFrom(locationFrom);
        //            route.setTo(locationTo);
        //            route.setDistance(request.getDistance());

        //            String soapRequest = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"" + namespace + "\">" +
        //                    "<soapenv:Header/>" +
        //                    "<soapenv:Body>" +
        //                    "<gs:putRouteRequest>" +
        //                    "<gs:route>" +
        //                    "<gs:id>0</gs:id>" + // Set id to 0, as it will be generated by the core service
        //                    "<gs:name>" + route.getName() + "</gs:name>" +
        //                    "<gs:coordinates>" +
        //                    "<gs:x>" + cc.getX() + "</gs:x>" +
        //                    "<gs:y>" + cc.getY() + "</gs:y>" +
        //                    "</gs:coordinates>" +
        //                    "<gs:from>" +
        //                    "<gs:id>" + locationFrom.getId() + "</gs:id>" +
        //                    "<gs:x>" + locationFrom.getX() + "</gs:x>" +
        //                    "<gs:y>" + locationFrom.getY() + "</gs:y>" +
        //                    "<gs:z>" + locationFrom.getZ() + "</gs:z>" +
        //                    "<gs:name>" + locationFrom.getName() + "</gs:name>" +
        //                    "</gs:from>" +
        //                    "<gs:to>" +
        //                    "<gs:id>" + locationTo.getId() + "</gs:id>" +
        //                    "<gs:x>" + locationTo.getX() + "</gs:x>" +
        //                    "<gs:y>" + locationTo.getY() + "</gs:y>" +
        //                    "<gs:z>" + locationTo.getZ() + "</gs:z>" +
        //                    "<gs:name>" + locationTo.getName() + "</gs:name>" +
        //                    "</gs:to>" +
        //                    "<gs:distance>" + route.getDistance() + "</gs:distance>" +
        //                    "</gs:route>" +
        //                    "</gs:putRouteRequest>" +
        //                    "</soapenv:Body>" +
        //                    "</soapenv:Envelope>";

        // Send the SOAP request

        //            // Process the response
        //            if (responseEntity.getStatusCode().is2xxSuccessful()) {
        //                response.setStatus("OK");
        //                response.setMessage("Ok");
        //            } else {
        //                response.setStatus("INTERNAL_SERVER_ERROR");
        //                response.setMessage("Could not perform action\nTry later");
        //            }
        //        } catch (HttpClientErrorException | HttpServerErrorException e) {
        //            response.setStatus("INTERNAL_SERVER_ERROR");
        //            response.setMessage("Could not perform action\nTry later");
        //        } catch (Exception e) {
        //            response.setStatus("INTERNAL_SERVER_ERROR");
        //            response.setMessage("Could not perform request to core service\nTry later");
        //        }
        return response;
    }
    //    private Location findLocationById(Long id) {
    //        String urlFrom = coreUrl + "?" + "filter" + "=" + "from.id_eq_" + id;
    //
    //        try {
    //            ResponseEntity<GetStat> responseFrom = discoveryService
    //                    .t()
    //                    .getForEntity(urlFrom, GetStat.class);
    //
    //            if (
    //                    responseFrom.getStatusCode() == HttpStatus.OK &&
    //                            responseFrom.getBody() != null
    //            ) {
    //                List<Route> routes = responseFrom.getBody().getRoutes();
    //
    //                if (!routes.isEmpty()) {
    //                    return routes.get(0).getFrom();
    //                } else {
    //                    return findLocationByToId(id);
    //                }
    //            } else if (responseFrom.getStatusCode() == HttpStatus.NOT_FOUND) {
    //                return findLocationByToId(id);
    //            } else {
    //                return null;
    //            }
    //        } catch (HttpClientErrorException e) {
    //            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
    //                return findLocationByToId(id);
    //            }
    //            return null;
    //        } catch (HttpServerErrorException e) {
    //            return null;
    //        }
    //    }
    //
    //    private Location findLocationByToId(Long id) {
    //        String urlTo = coreUrl + "?" + "filter" + "=" + "to.id_eq_" + id;
    //
    //        try {
    //            ResponseEntity<GetStat> responseTo = discoveryService
    //                    .t()
    //                    .getForEntity(urlTo, GetStat.class);
    //
    //            if (
    //                    responseTo.getStatusCode() == HttpStatus.OK &&
    //                            responseTo.getBody() != null
    //            ) {
    //                List<Route> routes = responseTo.getBody().getRoutes();
    //                if (!routes.isEmpty()) {
    //                    return routes.get(0).getTo();
    //                } else {
    //                    return null;
    //                }
    //            } else {
    //                return null;
    //            }
    //        } catch (HttpClientErrorException | HttpServerErrorException e) {
    //            return null;
    //        }
    //    }

}
