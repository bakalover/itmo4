// src/main/java/com/soa/navigator/controller/NavigatorResource.java
package com.soa.navigatorspring.controller;

import com.soa.navigatorspring.model.Coordinates;
import com.soa.navigatorspring.model.GetStat;
import com.soa.navigatorspring.model.Location;
import com.soa.navigatorspring.model.Route;
import com.soa.navigatorspring.service.DiscoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/")
public class NavigatorController {

    private final DiscoveryService discoveryService;

    public NavigatorController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }


    @GetMapping("/")
    public String getDataFromCore() {
        return discoveryService.getCoreHello();
    }

    //private final RestTemplate restTemplate;

//    @Value("${core.server.url}")
//    private String coreServerUrl;


//    public NavigatorController(RestTemplateBuilder restTemplateBuilder) {
//        this.restTemplate = restTemplateBuilder.connectTimeout(Duration.ofSeconds(3)).readTimeout(Duration.ofSeconds(3)).build();
//    }

    private ResponseEntity<String> handleCoreServiceError(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Could not perform request to core service\nTry later");
    }

    private boolean isResponseStatusOK(ResponseEntity<?> response) {
        return response.getStatusCode() == HttpStatus.OK;
    }

    private boolean isResponseStatusBadRequest(ResponseEntity<?> response) {
        return response.getStatusCode() == HttpStatus.BAD_REQUEST;
    }

    private boolean isResponseStatusNotFound(ResponseEntity<?> response) {
        return response.getStatusCode() == HttpStatus.NOT_FOUND;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello");
    }


//    @GetMapping("/routes/{id-from}/{id-to}/{order-by}")
//    public ResponseEntity<?> getAllRoutesBetweenLocations(
//            @PathVariable("id-from") Long idFrom,
//            @PathVariable("id-to") Long idTo,
//            @PathVariable("order-by") String orderBy
//    ) {
//        String url = UriComponentsBuilder.fromPath(coreServerUrl)
//                .queryParam("filter", "from.id_eq_" + idFrom + "," + "to.id_eq_" + idTo)
//                .queryParam("sort", orderBy)
//                .toUriString();
//
//        try {
//            ResponseEntity<GetStat> routesResponse = restTemplate.getForEntity(url, GetStat.class);
//
//            if (isResponseStatusOK(routesResponse)) {
//                GetStat stat = routesResponse.getBody();
//                return ResponseEntity.ok(stat.getRoutes());
//            } else if (isResponseStatusBadRequest(routesResponse)) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("Incorrect sort parameters are provided");
//            } else if (isResponseStatusNotFound(routesResponse)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body("There are no routes from  " + idFrom + " to " + idTo);
//            } else {
//                return ResponseEntity.status(routesResponse.getStatusCode()).body(routesResponse.getBody());
//            }
//
//        } catch (HttpClientErrorException e) {
//            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("Incorrect sort parameters are provided");
//            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body("There are no routes from  " + idFrom + " to " + idTo);
//            }
//            return handleCoreServiceError(e);
//        } catch (HttpServerErrorException e) {
//            return handleCoreServiceError(e);
//        } catch (Exception e) {
//            return handleCoreServiceError(e);
//        }
//    }
//
//
//    @PostMapping("/route/add/{id-from}/{id-to}/{distance}")
//    public ResponseEntity<String> addRouteBetweenLocations(
//            @PathVariable("id-from") Long idFrom,
//            @PathVariable("id-to") Long idTo,
//            @PathVariable("distance") Integer distance
//    ) {
//        if (idFrom < 1) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("id of start location (from) must be positive");
//        }
//        if (idTo < 1) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("id of finish location (to) must be positive");
//        }
//        if (distance <= 1) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("distance must be greater than 1");
//        }
//
//        try {
//            Location locationFrom = findLocationById(idFrom);
//            if (locationFrom == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("Could not find location with id = " + idFrom);
//            }
//
//            Location locationTo = findLocationById(idTo);
//            if (locationTo == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("Could not find location with id = " + idTo);
//            }
//
//            Route route = new Route();
//            route.setName(
//                    "from_" +
//                            locationFrom.getName() +
//                            "_to_" +
//                            locationTo.getName() +
//                            "_distance_" +
//                            distance
//            );
//            Coordinates cc = new Coordinates();
//            cc.setX(0);
//            cc.setY(0);
//            route.setCoordinates(cc);
//            route.setFrom(locationFrom);
//            route.setTo(locationTo);
//            route.setDistance(distance);
//
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            HttpEntity<Route> entity = new HttpEntity<>(route, headers);
//
//            return restTemplate.exchange(coreServerUrl, HttpMethod.PUT, entity, String.class);
//
//        } catch (HttpClientErrorException | HttpServerErrorException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(e.getStatusCode())
//                    .body("Could not perform action\nTry later");
//        } catch (Exception e) {
//            return handleCoreServiceError(e);
//        }
//    }
//
//
//    private Location findLocationById(Long id) {
//        String urlFrom = UriComponentsBuilder.fromPath(coreServerUrl)
//                .queryParam("filter", "from.id_eq_" + id)
//                .toUriString();
//        String urlTo = UriComponentsBuilder.fromPath(coreServerUrl)
//                .queryParam("filter", "to.id_eq_" + id)
//                .toUriString();
//
//        try {
//            ResponseEntity<GetStat> responseFrom = restTemplate.getForEntity(urlFrom, GetStat.class);
//
//            if (responseFrom.getStatusCode() == HttpStatus.OK && responseFrom.getBody() != null) {
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
//
//    }
//
//
//    private Location findLocationByToId(Long id) {
//        String urlTo = UriComponentsBuilder.fromPath(coreServerUrl)
//                .queryParam("filter", "to.id_eq_" + id)
//                .toUriString();
//
//        try {
//            ResponseEntity<GetStat> responseTo = restTemplate.getForEntity(urlTo, GetStat.class);
//
//            if (responseTo.getStatusCode() == HttpStatus.OK && responseTo.getBody() != null) {
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
//
//    }
}