import React, { useEffect, useState } from 'react';
import { getRoutes, addRoute, getRouteById, updateRouteById, deleteRouteById } from '../api';

const AddRoute: React.FC = () => {



const [routes, setRoutes] = useState([]);

const [isSimple, setIsSimple] = useState(false);

const [newRoute, setNewRoute] = useState({ from: '', to: '', distance: 0 });

  const fetchRoutes = async () => {
    const data = await getRoutes({});
    setRoutes(data);
  };



  const handleAddRoute = async () => {
    await addRoute(newRoute);
    fetchRoutes();
  };

 const [detailedRoute, setDetailedRoute] = useState({
    name: '',
    coordinates: { x: '', y: '' },
    from: { x: '', y: '', z: 0, name: '' },
    to: { x: '', y: '', z: 0, name: '' },
    distance: '',
  });

  return  (
  <div>
  <h2>Добавить новый маршрут</h2>
              <button onClick={() => setIsSimple(!isSimple)}>
                Переключить режим ввода
              </button>
              <br/>
  {!isSimple ? (
                  <div>
                    <label htmlFor="route-name">Название маршрута</label>
                    <br/>
                    <input
                        id="route-name"
                        type="text"
                        placeholder="Москва-Питер"
                        value={detailedRoute.name}
                        onChange={(e) => setDetailedRoute({...detailedRoute, name: e.target.value})}
                    />
                    <br/>
                    <p>Координаты</p>


                    <label htmlFor="coordinates-x">X</label>
                    <input
                        id="coordinates-x"
                        type="number"
                        placeholder="X"
                        value={detailedRoute.coordinates.x}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          coordinates: {...detailedRoute.coordinates, x: e.target.value}
                        })}
                    />
                    <label htmlFor="coordinates-y">Y</label>
                    <input
                        id="coordinates-y"
                        type="number"
                        placeholder="Y"
                        value={detailedRoute.coordinates.y}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          coordinates: {...detailedRoute.coordinates, y: e.target.value}
                        })}
                    />

                    <h3>Начальная точка</h3>
                    <label htmlFor="from-name">Название</label>
                    <br/>
                    <input
                        id="from-name"
                        type="text"
                        placeholder="Москва"
                        value={detailedRoute.from.name}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          from: {...detailedRoute.from, name: e.target.value}
                        })}
                    />
                    <br/>
                    <p>Координаты</p>
                    <label htmlFor="from-x"> X</label>
                    <input
                        id="from-x"
                        type="number"
                        value={detailedRoute.from.x}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          from: {...detailedRoute.from, x: e.target.value}
                        })}
                    />

                    <label htmlFor="from-y"> Y</label>
                    <input
                        id="from-y"
                        type="number"
                        value={detailedRoute.from.y}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          from: {...detailedRoute.from, y: e.target.value}
                        })}
                    />

                    <h3>Конечная точка</h3>
                    <label htmlFor="to-name">Название</label>
                    <br/>
                    <input
                        id="to-name"
                        type="text"
                        placeholder="Санкт-Петербург"
                        value={detailedRoute.to.name}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          to: {...detailedRoute.to, name: e.target.value}
                        })}
                    />
                     <br/>
                      <p>Координаты</p>
                    <label htmlFor="to-x"> X</label>
                    <input id="to-x"
                           type="number"
                           value={detailedRoute.to.x}
                           onChange={(e) => setDetailedRoute({
                             ...detailedRoute,
                             to: {...detailedRoute.to, x: e.target.value}
                           })}
                    />

                    <label htmlFor="to-y"> Y</label>
                    <input
                        id="to-y"
                        type="number"
                        value={detailedRoute.to.y}
                        onChange={(e) => setDetailedRoute({
                          ...detailedRoute,
                          to: {...detailedRoute.to, y: e.target.value}
                        })}
                    />
                    <br/>
                    <label htmlFor="distance">Длина маршрута</label>
                    <br/>
                    <input
                        id="distance"
                        type="number"
                        placeholder="700"
                        value={detailedRoute.distance}
                        onChange={(e) => setDetailedRoute({...detailedRoute, distance: e.target.value})}
                    />
                  </div>
              ) : (
                  <div>
                    <label htmlFor="route-source">Id начальной точки маршрута</label>
                    <br/>
                    <input
                        id="route-source"
                        type="text"
                        placeholder="От"
                        value={newRoute.from}
                        onChange={(e) => setNewRoute({...newRoute, from: e.target.value})}
                    />
                    <br/>
                    <label htmlFor="route-destination">Id конечной точки маршрута:</label>
                    <br/>
                    <input
                        id="route-destination"
                        type="text"
                        placeholder="До"
                        value={newRoute.to}
                        onChange={(e) => setNewRoute({...newRoute, to: e.target.value})}
                    />
                    <br/>
                    <label htmlFor="distance">Длина маршрута</label>
                    <br/>
                    <input
                        id="distance"
                        type="number"
                        placeholder="1"
                        value={newRoute.distance}
                        //onChange={(e) => setNewRoute({...newRoute, distance: e.target.value})}
                    />
                  </div>
              )}
              <button onClick={handleAddRoute}>Добавить</button>
              </div>
  )
};

export default AddRoute;
