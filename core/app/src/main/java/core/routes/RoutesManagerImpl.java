package core.routes;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;

import core.model.Route;

@Stateless
public class RoutesManagerImpl implements RoutesManager {
    @PersistenceContext(unitName = "routes persistence unit")
    private EntityManager em;

    private Route safeFind(Long id) throws EntityNotFoundException {
        var r = em.find(Route.class, id);
        if (r == null) {
            throw new EntityNotFoundException("Route with id " + id + " not found");

        }
        return r;
    }

    @Override
    public void addRoute(Route r)
            throws EntityExistsException {
        em.persist(r);
    }

    @Override
    public Route getRoute(Long id) throws IllegalArgumentException {
        return em.find(Route.class, id);
    }

    @Override
    public List<Route> getRoutes(Optional<List<String>> filters)
            throws EntityNotFoundException {

        var result = em.createQuery("SELECT * FROM routes", Route.class)
                .getResultList();
        if (result.isEmpty()) {
            throw new EntityNotFoundException("Routes collection is empty");
        }

        var filtered = applyFilters(filters);
        if (filtered.isEmpty()) {
            throw new EntityNotFoundException("Routes collection is empty after filter apply");
        }

        return filtered;
    }

    private List<Route> applyFilters(Optional<List<String>> filters) {
        // Somehow apply filters
        return null;
    }

    @Override
    public void deleteRoute(Long id)
            throws EntityNotFoundException {
        var r = safeFind(id);
        em.remove(r);
    }

    @Override
    public void updateRoute(Route updatedRoute)
            throws EntityNotFoundException {
        var r = safeFind(updatedRoute.getId());
        mergeRoutes(r, updatedRoute);
    }

    private void mergeRoutes(Route o, Route n) {
        o.setCoordinates(n.getCoordinates());
        o.setDistance(n.getDistance());
        o.setFrom(n.getFrom());
        o.setTo(n.getTo());
        o.setName(n.getName());
        em.merge(o);
    }

    @Override
    public Route minRoute() throws EntityNotFoundException {
        var routes = getRoutes(Optional.empty());
        return routes.stream().min(Comparator.comparingLong(Route::getId)).get(); // Should be at least one
    }

    @Override
    public List<Route> distanceEqual(Integer searchD) throws EntityNotFoundException {
        return distanceByCriteria(entityD -> entityD == searchD);
    }

    @Override
    public List<Route> distanceGreater(Integer searchD) throws EntityNotFoundException {
        return distanceByCriteria(entityD -> entityD > searchD);
    }

    private List<Route> distanceByCriteria(Predicate<Integer> f)
            throws EntityNotFoundException {
        var routes = getRoutes(Optional.empty());
        var result = routes
                .stream()
                .filter(r -> f.test(r.getDistance()))
                .collect(Collectors.toList());
        if (result.isEmpty()) {
            throw new EntityNotFoundException("There is no routes with specified distance criteria");
        }
        return result;
    }

}
