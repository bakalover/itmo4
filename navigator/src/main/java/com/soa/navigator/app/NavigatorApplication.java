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
import com.soa.navigator.helpers.validation.Order;

@ApplicationPath("/navigator")
public class NavigatorApplication extends Application {

    private final String coreServerUrl = "localhost:5000/routes";
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
        order(routes, orderBy);
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


    void order(List<Route> routes, String orderBy) {
        routes.sort((route1, route2) -> {
            try {
                Order orderField = Order.valueOf(orderBy.toUpperCase()); // Преобразуем orderBy в верхний регистр
                System.out.println(orderField + " " + orderBy);
                switch (orderField) {
                    case NAME:
                        return route1.getName().compareTo(route2.getName());
                    case FROM_X:
                        return Double.compare(route1.getFrom().getX(), route2.getFrom().getX());
                    case FROM_Y:
                        return Long.compare(route1.getFrom().getY(), route2.getFrom().getY());
                    case FROM_NAME:
                        return route1.getFrom().getName().compareTo(route2.getFrom().getName());
                    case TO_X:
                        return Double.compare(route1.getTo().getX(), route2.getTo().getX());
                    case TO_Y:
                        return Long.compare(route1.getTo().getY(), route2.getTo().getY());
                    case TO_NAME:
                        return route1.getTo().getName().compareTo(route2.getTo().getName());
                    case COORDINATES_X:
                        return Double.compare(route1.getCoordinates().getX(), route2.getCoordinates().getX());
                    case COORDINATES_Y:
                        return Long.compare(route1.getCoordinates().getY(), route2.getCoordinates().getY());
                    case DISTANCE:
                        return Double.compare(route1.getDistance(), route2.getDistance());
                    default:
                        return 0; // Отсортировать по умолчанию (не сортировать)
                }
            } catch (IllegalArgumentException e) {
                // Обработка ошибки, если orderBy не является допустимым значением перечисления
                System.err.println("Неверный параметр сортировки: " + orderBy);
                return 0;
            }
        });
    }


}