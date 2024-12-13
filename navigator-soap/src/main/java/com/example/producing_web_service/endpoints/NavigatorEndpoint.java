package com.example.producing_web_service.endpoints;

import com.service.navigator.*;
import org.springframework.http.*;
import org.springframework.ws.client.core.WebServiceTemplate;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;


@Endpoint
public class NavigatorEndpoint {
    private static final String NAMESPACE_URI = "http://navigator.service.com";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "helloRequest")
    @ResponsePayload
    public HelloResponse getHello(@RequestPayload HelloRequest helloRequest) {
        HelloResponse response = new HelloResponse();
        response.setMessage("Hello World");
        return response;
    }

//    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getAllRoutesBetweenLocationsRequest")
//    @ResponsePayload
//    public GetAllRoutesBetweenLocationsResponse getAllRoutesBetweenLocations(
//            @RequestPayload GetAllRoutesBetweenLocationsRequest request
//    ) {
//        GetAllRoutesBetweenLocationsResponse response = new GetAllRoutesBetweenLocationsResponse();
//        String filterString = "filter=from.id_eq_" + request.getIdFrom() + ",to.id_eq_" + request.getIdTo();
//        String sortString = "&sort=" + request.getOrderBy();
//
//        /*
//        Perform getAllRoutes request to Mule application. Unpack returned data to getAllRoutesResponse:
//
//        <xs:element name="getAllRoutesResponse">
//        <xs:complexType>
//            <xs:sequence>
//                <xs:element name="getStat" type="tns:GetStat" minOccurs="0"/>
//                <xs:element name="fault" type="tns:Fault" minOccurs="0"/>
//            </xs:sequence>
//        </xs:complexType>
//    </xs:element>
//         */
//
//        try {
//            ResponseEntity<GetStat> routesResponse = discoveryService
//                    .t()
//                    .getForEntity(url, GetStat.class);
//
//            if (routesResponse.getStatusCode() == HttpStatus.OK) {
//                GetStat stat = routesResponse.getBody();
//                response.setRoutes(stat.getRoutes());
//                response.setStatus("OK");
//            } else if (routesResponse.getStatusCode() == HttpStatus.BAD_REQUEST) {
//                response.setStatus("BAD_REQUEST");
//                response.setMessage("Incorrect sort parameters are provided");
//            } else if (routesResponse.getStatusCode() == HttpStatus.NOT_FOUND) {
//                response.setStatus("NOT_FOUND");
//                response.setMessage("There are no routes from  " + request.getIdFrom() + " to " + request.getIdTo());
//            } else {
//                response.setStatus(routesResponse.getStatusCode().toString());
//                response.setMessage(routesResponse.getBody().toString());
//            }
//        } catch (HttpClientErrorException e) {
//            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
//                response.setStatus("BAD_REQUEST");
//                response.setMessage("Incorrect sort parameters are provided");
//            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
//                response.setStatus("NOT_FOUND");
//                response.setMessage("There are no routes from  " + request.getIdFrom() + " to " + request.getIdTo());
//            } else {
//                response.setStatus("INTERNAL_SERVER_ERROR");
//                response.setMessage("Could not perform request to core service\nTry later");
//            }
//        } catch (HttpServerErrorException e) {
//            response.setStatus("INTERNAL_SERVER_ERROR");
//            response.setMessage("Could not perform request to core service\nTry later");
//        } catch (Exception e) {
//            response.setStatus("INTERNAL_SERVER_ERROR");
//            response.setMessage("Could not perform request to core service\nTry later");
//        }
//        return response;
//    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addRouteBetweenLocationsRequest")
    @ResponsePayload
    public AddRouteBetweenLocationsResponse addRouteBetweenLocations(
            @RequestPayload AddRouteBetweenLocationsRequest request
    ) {
        AddRouteBetweenLocationsResponse response = new AddRouteBetweenLocationsResponse();

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

            // Create the SOAP request
            String coreUrl = "http://localhost:39080/mule/routes";
            Route route = new Route();

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
            WebServiceTemplate webTemplate = new WebServiceTemplate();
            Object object = webTemplate.marshalSendAndReceive(coreUrl, route);

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
