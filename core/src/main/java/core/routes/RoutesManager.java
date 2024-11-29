package core.routes;

import java.util.List;
import java.util.function.Predicate;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import core.model.Route;

public interface RoutesManager {
        public void addRoute(Route r)
                        throws EntityExistsException;

        public Route getRoute(Integer id)
                        throws EntityNotFoundException;

        public List<Route> getRoutes(List<Predicate<Route>> fs)
                        throws EntityNotFoundException;

        public void deleteRoute(Integer id)
                        throws EntityNotFoundException;

        public void updateRoute(Route updatedRoute)
                        throws EntityNotFoundException;

        public Route minRoute()
                        throws EntityNotFoundException;

        public List<Route> distanceEqual(long d)
                        throws EntityNotFoundException;

        public List<Route> distanceGreater(long d)
                        throws EntityNotFoundException;
}
