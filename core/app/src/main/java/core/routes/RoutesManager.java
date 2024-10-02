package core.routes;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import core.model.Route;

public interface RoutesManager {
        public void addRoute(Route r)
                        throws EntityExistsException;

        public Route getRoute(Long id)
                        throws EntityNotFoundException;

        public List<Route> getRoutes(Optional<List<String>> filters)
                        throws EntityNotFoundException;

        public void deleteRoute(Long id)
                        throws EntityNotFoundException;

        public void updateRoute(Route updatedRoute)
                        throws EntityNotFoundException;

        public Route minRoute()
                        throws EntityNotFoundException;

        public List<Route> distanceEqual(Integer d)
                        throws EntityNotFoundException;

        public List<Route> distanceGreater(Integer d)
                        throws EntityNotFoundException;
}
