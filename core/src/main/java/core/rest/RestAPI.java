/*
 * This source file was generated by the Gradle 'init' task
 */
package core.rest;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.ws.rs.core.Response.Status;
import core.helpers.Filter;
import core.model.*;
import core.routes.RoutesManager;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;

@ApplicationScoped
@Path("/routes")
@Slf4j
public class RestAPI extends Application {

    @Inject
    private RoutesManager rm;

    private final String justOk = "Ok";

    // All Exceptions will be intercepted via ExceptionToStatus class
    private Response okWith(Object entity) {
        return Response.ok(entity).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllRoutes(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("sort") String sort,
            @QueryParam("filter") String filters) {

        log.info("Got params:\npage:{}\nsize:{}\nsort:{}\nfilters:{}", page, size, sort, filters);
        if (page < 0) {
            return Response.status(Status.BAD_REQUEST).entity("Invalid page value").build();
        }
        if (size <= 0) {
            return Response.status(Status.BAD_REQUEST).entity("Invalid size value").build();
        }
        GetStat stat = new GetStat();
        List<Route> routes;
        var all = rm.getRoutes(Filter.withoutFilters());
        routes = all;
        if (filters != null) {
            routes = Filter.applyFilters(routes, Filter.tryParseFilters(filters));
            if (routes.isEmpty()) {
                return Response.status(Status.NOT_FOUND).entity("No routes after filter apply").build();
            }
        }
        if (sort != null && routes.size() > 1) {
            var sorts = Filter.tryParseSort(sort);
            log.info("Total sort functions: {}", sorts.size());
            routes = Filter.applySorts(routes, sorts);
        }
        stat.setRoutes(routes);
        stat.setNumberOfElements(routes.size());
        stat.setTotalElements(all.size());

        stat.setTotalPages((int) Math.ceil((double) stat.getTotalElements() / (double) size));
        if (page == 0) { // All routes, size - ignored
            return okWith(stat);
        }
        var routesCutted = Filter.cut(routes, page, size);
        if (routesCutted.isEmpty()) {
            return Response.status(Status.NOT_FOUND).entity("No routes at specified page").build();
        }
        stat.setRoutes(routesCutted);
        stat.setNumberOfElements(routesCutted.size());
        return okWith(stat);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRoute(@PathParam("id") int id) {
        log.info("Get route by id: {}", id);
        return okWith(rm.getRoute(id));
    }

    @GET
    @Path("/min-id")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMinRoute() {
        return okWith(rm.minRoute());
    }

    @GET
    @Path("/distance/count/{value}")
    public Response getRouteCount(@PathParam("value") int value) {
        log.info("Get route with distance value: {}", value);
        return okWith(rm.distanceEqual(value).size());
    }

    @GET
    @Path("/distance/greater/{value}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRouteAbove(@PathParam("value") int value) {
        log.info("Get route with distance value grater than: {}", value);
        return okWith(rm.distanceGreater(value));
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addNewRoute(@Valid Route route) {
        log.info("Got route: {}", route);
        rm.addRoute(route);
        return okWith(justOk);
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateRoute(@PathParam("id") int id, @Valid Route route) {
        route.setId(id);
        log.info("Update route, new route: {}", route);
        rm.updateRoute(route);
        return okWith(justOk);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteRoute(@PathParam("id") int id) {
        log.info("Delete route with id:{}", id);
        rm.deleteRoute(id);
        return okWith(justOk);
    }
}
