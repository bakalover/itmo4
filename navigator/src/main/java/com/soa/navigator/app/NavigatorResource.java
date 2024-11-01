package com.soa.navigator.app;

import com.soa.navigator.model.Coordinates;
import com.soa.navigator.model.GetStat;
import com.soa.navigator.model.Location;
import com.soa.navigator.model.Route;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("navigator")
public class NavigatorResource {

    private final String coreServerUrl = "https://localhost:35443/routes";
    private final Client client = ClientBuilder.newClient();
    private final WebTarget target = client.target(coreServerUrl);

    private Response okWith(Object entity) {
        return Response.ok(entity).build();
    }

    boolean isResponseStatusOK(Response response) {
        return response.getStatus() == Response.Status.OK.getStatusCode();
    }

    boolean isResponseStatusCrashed(Response response) {
        return (
            response.getStatus() ==
            Response.Status.INTERNAL_SERVER_ERROR.getStatusCode()
        );
    }

    boolean isResponseStatusNotFound(Response response) {
        return (
            response.getStatus() == Response.Status.NOT_FOUND.getStatusCode()
        );
    }

    boolean isResponseStatusBadRequest(Response response) {
        return (
            response.getStatus() == Response.Status.BAD_REQUEST.getStatusCode()
        );
    }

    @GET
    @Path("/hello")
    @Produces("application/json")
    public Response hello() {
        String hello = "Hello";
        return Response.ok(hello).build();
    }

    @GET
    @Path("/routes/{id-from}/{id-to}/{order-by}")
    @Produces("application/json")
    public Response getAllRoutesBetweenLocations(
        @PathParam("id-from") Long idFrom,
        @PathParam("id-to") Long idTo,
        @PathParam("order-by") String orderBy
    ) {
        Response routesResponse;

        var routesRequest = target
            .path("/")
            .queryParam("filter", "from.id_eq_" + idFrom + "," + "to.id_eq_" + idTo)
            .queryParam("sort", orderBy)
            .request(MediaType.APPLICATION_JSON);
        try {
            routesResponse = routesRequest.get();
        } catch (ProcessingException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Could not perform request to service\nTry later")
                .build();
        }

        if (isResponseStatusOK(routesResponse)) {
            var stat = routesResponse.readEntity(GetStat.class);
            return okWith(stat.getRoutes());
        } else {
            if (
                isResponseStatusBadRequest(routesResponse)
            ) return Response.status(Response.Status.BAD_REQUEST)
                .entity("Incorrect sort parameters are provided")
                .build();
            else if (isResponseStatusNotFound(routesResponse)) {
                return Response.status(Response.Status.NOT_FOUND)
                    .entity(
                        "There are no routes from  " + idFrom + " to " + idTo
                    )
                    .build();
            } else return routesResponse;
        }
    }

    @POST
    @Path("/route/add/{id-from}/{id-to}/{distance}")
    public Response addRouteBetweenLocations(
        @PathParam("id-from") Long idFrom,
        @PathParam("id-to") Long idTo,
        @PathParam("distance") Integer distance
    ) {
        // Validate input parameters
        if (idFrom < 1) return Response.status(Response.Status.BAD_REQUEST)
            .entity("id of start location (from) must be positive")
            .build();
        if (idTo < 1) return Response.status(Response.Status.BAD_REQUEST)
            .entity("id of finish location (to) must be positive")
            .build();
        if (distance <= 1) return Response.status(Response.Status.BAD_REQUEST)
            .entity("distance must be greater than 1")
            .build();

        try {
            // Find the 'from' location
            Location locationFrom = findLocationById(idFrom);
            if (locationFrom == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Could not find location with id = " + idFrom)
                    .build();
            }

            // Find the 'to' location
            Location locationTo = findLocationById(idTo);
            if (locationTo == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Could not find location with id = " + idTo)
                    .build();
            }

            // Both locations are found, proceed to create the route
            Route route = new Route();
            route.setName(
                "from_" +
                locationFrom.getName() +
                "_to_" +
                locationTo.getName() +
                "_distance_" +
                distance
            );
            var cc = new Coordinates();
            cc.setX(0);
            cc.setY(0);
            route.setCoordinates(cc); // Assuming default coordinates
            route.setFrom(locationFrom);
            route.setTo(locationTo);
            route.setDistance(distance);

            // Create the route by sending a PUT request
            return target
                .path("/")
                .request(MediaType.APPLICATION_JSON)
                .put(Entity.entity(route, MediaType.APPLICATION_JSON));
        } catch (ProcessingException | WebApplicationException e) {
            // Handle any unexpected exceptions
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Could not perform action\nTry later")
                .build();
        }
    }

    // Helper method to find a Location by its ID
    private Location findLocationById(Long id) {
        // First, make a request with 'from.id'
        Response response = target
            .path("/")
            .queryParam("filter", "from.id_eq_" + id)
            .request(MediaType.APPLICATION_JSON)
            .get();

        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
            // Response is OK, check if routes are found
            GetStat getStat = response.readEntity(GetStat.class);
            List<Route> routes = getStat.getRoutes();

            if (!routes.isEmpty()) {
                // Routes found using 'from.id', return the 'from' location
                return routes.get(0).getFrom();
            } else {
                // No routes found, try with 'to.id'
                return findLocationByToId(id);
            }
        } else if (
            response.getStatus() == Response.Status.NOT_FOUND.getStatusCode()
        ) {
            // 'from.id' not found, try with 'to.id'
            return findLocationByToId(id);
        } else {
            // Other response status, treat as error
            return null;
        }
    }

    // Helper method to find a Location using 'to.id'
    private Location findLocationByToId(Long id) {
        Response response = target
            .path("/")
            .queryParam("filter", "to.id_eq_" + id)
            .request(MediaType.APPLICATION_JSON)
            .get();

        if (response.getStatus() == Response.Status.OK.getStatusCode()) {
            // Response is OK, check if routes are found
            GetStat getStat = response.readEntity(GetStat.class);
            List<Route> routes = getStat.getRoutes();

            if (!routes.isEmpty()) {
                // Routes found using 'to.id', return the 'to' location
                return routes.get(0).getTo();
            } else {
                // No routes found, return null
                return null;
            }
        } else {
            // 'to.id' not found or other error, return null
            return null;
        }
    }
}
