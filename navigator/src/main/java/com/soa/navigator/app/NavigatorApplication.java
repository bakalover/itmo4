package com.soa.navigator.app;

import com.soa.navigator.model.Route;
import jakarta.ws.rs.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
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
                .request(MediaType.APPLICATION_JSON).get(new GenericType<>() {});
        return okWith(routes);
    }


    @POST
    @Path("/route/add/{id-from}/{id-to}/{distance}")
    public Response addRouteBetweenLocations(@PathParam("id-from") Long idFrom, @PathParam("id-to") Long idTo, @PathParam("distance") Double distance) {
        return null;
        //return okWith();
    }

}