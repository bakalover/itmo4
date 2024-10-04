import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getRoutes, addRoute, getRouteById, updateRouteById, deleteRouteById } from './api';

function App() {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({ from: '', to: '', distance: 0 });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const data = await getRoutes({});
    setRoutes(data);
  };

  const handleAddRoute = async () => {
    await addRoute(newRoute);
    fetchRoutes();
  };

  const handleDeleteRoute = async (id: any) => {
    await deleteRouteById(id);
    fetchRoutes();
  };

  // @ts-ignore
  return (
      <div className="App">
        <header className="App-header">
          <h2>Маршруты</h2>
          <p>Тут будет таблица с маршрутами. В каждой строке 2 кнопки: подробнее и удалить</p>
          {/*<ul>*/}
          {/*  {routes.map(route => (*/}
          {/*      <li key={route.id}>*/}
          {/*        {route.from} to {route.to} - {route.distance} km*/}
          {/*        <button onClick={() => handleDeleteRoute(route.id)}>Delete</button>*/}
          {/*      </li>*/}
          {/*  ))}*/}
          {/*</ul>*/}
          <h2>Добавить новый маршрут</h2>
          <label htmlFor="route-source">Начальная точка маршрута</label>
          <input
              id = "route-source"
              type="text"
              placeholder="От"
              value={newRoute.from}
              onChange={(e) => setNewRoute({...newRoute, from: e.target.value})}
          />
          <label htmlFor="route-destination">Конечная точка маршрута:</label>
          <input
              id="route-destination"
              type="text"
              placeholder="До"
              value={newRoute.to}
              onChange={(e) => setNewRoute({...newRoute, to: e.target.value})}
          />
          <label htmlFor="distance">Длина маршрута</label>
          <input
              id="distance"
              type="number"
              placeholder="1"
              value={newRoute.distance}
              // onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
          />
          <button onClick={handleAddRoute}>Добавить</button>
        </header>
      </div>
  );
}

export default App;
