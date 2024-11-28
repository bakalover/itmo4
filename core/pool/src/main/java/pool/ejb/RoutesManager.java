package pool.ejb;

import jakarta.ejb.Remote;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.function.Predicate;
import pool.model.Route;

@Remote
public interface RoutesManager {
    public void addRoute(Route r) throws EntityExistsException;

    public Route getRoute(Long id) throws EntityNotFoundException;

    public List<Route> getRoutes(List<Predicate<Route>> fs)
        throws EntityNotFoundException;

    public void deleteRoute(Long id) throws EntityNotFoundException;

    public void updateRoute(Route updatedRoute) throws EntityNotFoundException;

    public Route minRoute() throws EntityNotFoundException;

    public List<Route> distanceEqual(Integer d) throws EntityNotFoundException;

    public List<Route> distanceGreater(Integer d)
        throws EntityNotFoundException;
}
