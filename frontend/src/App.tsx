import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getRoutes, addRoute, getRouteById, updateRouteById, deleteRouteById } from './api';
import AddRoute from './sub-pages/AddRoute';
import GetMinRoute from './sub-pages/GetMinRoute';
import GetRouteWithDistance from './sub-pages/GetRouteWithDistance';
import GetRoutesBetweenLocation from './sub-pages/GetRoutesBetweenLocation';


function App() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const data = await getRoutes({});
    setRoutes(data);
  };



  const handleDeleteRoute = async (id: any) => {
    await deleteRouteById(id);
    fetchRoutes();
  };




  const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const actions: { [key: string]: string } = {
      addRoute: 'Добавить маршрут',
      getMinRoute: 'Получить минимальный маршрут',
      getRouteWithDistance: 'Получить маршрут с расстоянием',
      getRoutesBetweenLocation: 'Получить маршруты между локациями',
    };

      const handleButtonClick = (action: keyof typeof actions) => {
        setSelectedAction(action as string); // Приведение типа к строке
      };

    const renderContent = () => {
        switch (selectedAction) {
          case 'addRoute':
            return <AddRoute />;
          case 'getMinRoute':
            return <GetMinRoute />;
          case 'getRouteWithDistance':
            return <GetRouteWithDistance />;
          case 'getRoutesBetweenLocation':
            return <GetRoutesBetweenLocation />;
          default:
            return null;
        }
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
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <div>
                        {Object.keys(actions).map((key) => (
                          <button key={key} onClick={() => handleButtonClick(key as keyof typeof actions)}>
                            {actions[key]}
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: '20px' }}>
                        {renderContent()}
                      </div>
           </div>
          <div>




          </div>
          <div>
            <p>Быстрые действия</p>
            <p>Маршрут с манимальным id</p>
            <p>Количество значений с заданным distance</p>
            <p>Объекты с distance большим заданного</p>
          </div>
        </header>
      </div>
  );
}

export default App;
