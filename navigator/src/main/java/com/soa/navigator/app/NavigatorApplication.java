package com.soa.navigator.app;

import com.soa.navigator.model.Location;
import com.soa.navigator.model.Route;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.GenericType;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationPath("/navigator")
public class NavigatorApplication extends Application {

    private final String coreServerUrl = "localhost:8080/routes";
    private final Client client = ClientBuilder.newClient();
    private final WebTarget target = client.target(coreServerUrl);

    // All Exceptions will be intercepted via ExceptionToStatus class
    private Response okWith(Object entity) {
        return Response.ok(entity).build();
    }

    @GET
    @Path("/routes/{id-from}/{id-to}/{order-by}")
    public Response getAllRoutesBetweenLocations(@PathParam("id-from") Long idFrom,
                                                 @PathParam("id-to") Long idTo,
                                                 @PathParam("order-by") String orderBy) {
        List<Route> routes = target.path("/").queryParam("filter", "idFrom=" + idFrom + "&idTo=" + idTo)
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {
                });
        return okWith(routes);
    }


    @POST
    @Path("/route/add/{id-from}/{id-to}/{distance}")
    public Response addRouteBetweenLocations(@PathParam("id-from") Long idFrom, @PathParam("id-to") Long idTo, @PathParam("distance") Integer distance) {
        Route route = new Route();
        //TODO create correct Route
        Location from = new Location();
        from.setName("from");
        from.setX(1.0);
        from.setY(1);
        from.setZ(1F);


        Location to = new Location();
        to.setName("to");
        to.setX(2.0);
        to.setY(2);
        to.setZ(2F);

        route.setFrom(from);
        route.setTo(to);
        route.setDistance(distance);
        return target.path("/route").request(MediaType.APPLICATION_JSON)
                .post(Entity.entity(route, MediaType.APPLICATION_JSON));
    }


}