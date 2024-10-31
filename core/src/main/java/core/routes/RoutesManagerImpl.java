package core.routes;

import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import core.helpers.Filter;
import core.model.Location;
import core.model.Route;
import lombok.extern.slf4j.Slf4j;

@Stateless
@Slf4j
public class RoutesManagerImpl implements RoutesManager {
    @PersistenceContext(unitName = "routesPersistence")
    private EntityManager em;

    private Route safeFind(Long id) throws EntityNotFoundException {
        var r = em.find(Route.class, id);
        if (r == null) {
            log.warn("Route with id:{} not found", id);
            throw new EntityNotFoundException("Route with id " + id + " not found");
        }
        return r;
    }

    @Override
    public void addRoute(Route r)
            throws EntityExistsException {
        var fromId = r.getFrom().getId();
        var toId = r.getTo().getId();
        if (fromId != null) {
            var query = em.createQuery(
                    "SELECT l FROM Location l WHERE l.id = :id", Location.class);
            query.setParameter("id", fromId);
            try {
                r.setFrom(query.getSingleResult());
            } catch (NoResultException e) {
                throw new NoResultException("There is no \"from\" Location with specified id");
            }

        }
        if (toId != null) {
            var query = em.createQuery(
                    "SELECT l FROM Location l WHERE l.id = :id", Location.class);
            query.setParameter("id", toId);
            try {
                r.setTo(query.getSingleResult());
            } catch (NoResultException e) {
                throw new NoResultException("There is no \"to\" Location with specified id");
            }
        }
        em.persist(r);
    }

    @Override
    public Route getRoute(Long id) throws EntityNotFoundException {
        return safeFind(id);
    }

    @Override
    public List<Route> getRoutes(List<Predicate<Route>> fs)
            throws EntityNotFoundException {

        var result = em.createNativeQuery("SELECT * FROM routes", Route.class)
                .getResultList();

        if (result.isEmpty()) {
            log.warn("No routes in persistence");
            throw new EntityNotFoundException("Routes collection is empty");
        }

        var filtered = Filter.applyFilters(result, fs);

        if (filtered.isEmpty()) {
            log.warn("Empty after filters");
            throw new EntityNotFoundException("Routes collection is empty after filter apply");
        }

        return filtered;
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
        var routes = getRoutes(Filter.withoutFilters());
        // Should be at least one, so there is no Exception on get()
        return routes.stream().min(Comparator.comparingLong(Route::getId)).get();
    }

    @Override
    public List<Route> distanceEqual(Integer searchD) throws EntityNotFoundException {
        return getRoutes(List.of(route -> route.getDistance().equals(searchD)));
    }

    @Override
    public List<Route> distanceGreater(Integer searchD) throws EntityNotFoundException {
        return getRoutes(List.of(route -> route.getDistance() > searchD));
    }

}
