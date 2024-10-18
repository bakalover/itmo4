package com.soa.navigator.app;

import com.soa.navigator.model.Coordinates;
import com.soa.navigator.model.GetStat;
import com.soa.navigator.model.GetStat.*;
import com.soa.navigator.model.Location;
import com.soa.navigator.model.Route;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("navigator")
public class NavigatorResource {
    private final String coreServerUrl = "http://localhost:35080/routes";
    private final Client client = ClientBuilder.newClient();
    private final WebTarget target = client.target(coreServerUrl);


    private Response okWith(Object entity) {
        return Response.ok(entity).build();
    }

    boolean isResponseStatusOK(Response response) {
        return response.getStatus() == Response.Status.OK.getStatusCode();
    }

    boolean isResponseStatusCrashed(Response response) {
        return response.getStatus() == Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
    }

    boolean isResponseStatusNotFound(Response response) {
        return response.getStatus() == Response.Status.NOT_FOUND.getStatusCode();
    }

    boolean isResponseStatusBadRequest(Response response) {
        return response.getStatus() == Response.Status.BAD_REQUEST.getStatusCode();
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
    public Response getAllRoutesBetweenLocations(@PathParam("id-from") Long idFrom, @PathParam("id-to") Long idTo,
                                                 @PathParam("order-by") String orderBy) {

        if (orderBy.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Ordering rule can not be empty.")
                    .build();
        }

        Response routesResponse = target.path("/")
                .queryParam("filter", "from.id:" + idFrom + "," + "to.id:" + idTo)
                .queryParam("sort", orderBy)
                .request(MediaType.APPLICATION_JSON).get();

        if (isResponseStatusOK(routesResponse)) {
            GetStat getStat = routesResponse.readEntity(new GenericType<>() {
            });
            return okWith(getStat);
        } else {
            if (isResponseStatusBadRequest(routesResponse))
                return Response.status(Response.Status.BAD_REQUEST).entity("Incorrect sort parameters are provided").build();
            else if (isResponseStatusNotFound(routesResponse)) {
                return Response.status(Response.Status.NOT_FOUND).entity("There are no routes from  " + idFrom + " to " + idTo).build();
            } else return routesResponse;
        }
    }




    @POST
    @Path("/route/add/{id-from}/{id-to}/{distance}")
    public Response addRouteBetweenLocations(@PathParam("id-from") Long idFrom, @PathParam("id-to") Long idTo,
                                             @PathParam("distance") Integer distance) {
        // "sort=x,from.x,coordinates.y"

        if (idFrom < 1 && idTo > 1)
            return Response.status(Response.Status.BAD_REQUEST).entity("id of start location (from) must be positive").build();
        if (idTo < 1 && idFrom > 1)
            return Response.status(Response.Status.BAD_REQUEST).entity("id of finish location (to) must be positive").build();
        if (idTo < 1 && idFrom < 1)
            return Response.status(Response.Status.BAD_REQUEST).entity("id of start (from) and finish (to) locations must be positive").build();
        if (distance <= 1)
            return Response.status(Response.Status.BAD_REQUEST).entity("distance must be greater than 1").build();


        Response routesWithFrom = target.path("/").queryParam("filter", "from.id:" + idFrom)
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                });
        if (isResponseStatusNotFound(routesWithFrom)) {
            //try to find all routes where current 'from' value is 'to' location
            routesWithFrom = target.path("/").queryParam("filter", "to.id:" + idFrom)
                    .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                    });
            if (isResponseStatusNotFound(routesWithFrom)) {
                return Response.status(Response.Status.NOT_FOUND).entity("Location with id = " + idFrom + " not found").build();
            }
        }

        Response routesWithTo = target.path("/").queryParam("filter", "to.id:" + idTo)
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                });

        if (isResponseStatusNotFound(routesWithTo)) {
            //try to find all routes where current 'to' value is 'from' location
            routesWithTo = target.path("/").queryParam("filter", "to.from:" + idTo)
                    .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                    });
            if (isResponseStatusNotFound(routesWithTo)) {
                return Response.status(Response.Status.NOT_FOUND).entity("Location with id = " + idTo + " not found").build();
            }
        }

        if (isResponseStatusOK(routesWithFrom) && isResponseStatusOK(routesWithTo)) {
            List<Route> routesFrom = routesWithFrom.readEntity(GetStat.class).getRoutes();
            List<Route> routesTo = routesWithTo.readEntity(GetStat.class).getRoutes();

            Location locationFrom = routesFrom.get(0).getFrom();
            Location locationTo = routesTo.get(0).getTo();
            Route route = new Route();

            route.setName(
                    "from_" + locationFrom.getName() + "_to_" + locationTo.getName() + "_distance_" + distance);
            route.setCoordinates(new Coordinates(0, 0));
            route.setFrom(locationFrom);
            route.setTo(locationTo);
            route.setDistance(distance);

            return target.path("/").request(MediaType.APPLICATION_JSON)
                    .put(Entity.entity(route, MediaType.APPLICATION_JSON));

        } else if (isResponseStatusCrashed(routesWithFrom)) return routesWithFrom;
        else if (isResponseStatusCrashed(routesWithTo)) return routesWithTo;
        else {
            return Response.status(Response.Status.BAD_REQUEST).entity("Request parameters can not be validated properly:\n"
                            + routesWithFrom.readEntity(new GenericType<>() {
                    })
                            + "\n"
                            + routesWithTo.readEntity(new GenericType<>() {
                    }))
                    .build();
        }

    }
}
