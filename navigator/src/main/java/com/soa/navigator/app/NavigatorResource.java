package com.soa.navigator.app;

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
        Response routesResponse = target.path("/")
                .queryParam("filter", "from.id:" + idFrom + "," + "to.id:" + idTo)
                .queryParam("sort", orderBy)
                .request(MediaType.APPLICATION_JSON).get();

        if (isResponseStatusOK(routesResponse)) {
            List<Route> routes = routesResponse.readEntity(new GenericType<>() {
            });
            if (routes.isEmpty())
                return Response.status(Response.Status.NOT_FOUND).build();
            return okWith(routes);
        } else {
            System.out.println("request status is: " + routesResponse.getStatus());
            if (isResponseStatusCrashed(routesResponse))
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            else
                return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @POST
    @Path("/route/add/{id-from}/{id-to}/{distance}")
    public Response addRouteBetweenLocations(@PathParam("id-from") Long idFrom, @PathParam("id-to") Long idTo,
            @PathParam("distance") Integer distance) {
        // "sort=x,from.x,coordinates.y"
        Response routesWithFrom = target.path("/").queryParam("filter", "from.id:" + idFrom)
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                });
        Response routesWithTo = target.path("/").queryParam("filter", "to.id:" + idTo)
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                });
        if (isResponseStatusOK(routesWithFrom) && isResponseStatusOK(routesWithTo)) {
            List<Route> routesFrom = routesWithFrom.readEntity(new GenericType<>() {
            });
            List<Route> routesTo = routesWithFrom.readEntity(new GenericType<>() {
            });
            if (!routesFrom.isEmpty() && !routesTo.isEmpty()) {
                Location locationFrom = routesFrom.get(0).getFrom();
                Location locationTo = routesTo.get(0).getTo();
                Route route = new Route();

                route.setName(
                        "from_" + locationFrom.getName() + "_to_" + locationTo.getName() + "_distance_" + distance);
                route.setFrom(locationFrom);
                route.setTo(locationTo);
                route.setDistance(distance);

                return target.path("/route").request(MediaType.APPLICATION_JSON)
                        .put(Entity.entity(route, MediaType.APPLICATION_JSON));

            } else
                return Response.status(Response.Status.BAD_REQUEST).build();
        } else if (isResponseStatusCrashed(routesWithFrom) || isResponseStatusCrashed(routesWithTo)) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        } else
            return Response.status(Response.Status.BAD_REQUEST).build();

    }
}
