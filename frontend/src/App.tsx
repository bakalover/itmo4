import React, { useEffect, useState } from 'react';
import './App.css';
import { deleteRouteById, getRoutes } from './api';
import AddRoute from './sub-pages/AddRoute';
import GetMinRoute from './sub-pages/GetMinRoute';
import GetRouteWithDistance from './sub-pages/GetRouteWithDistance';
import GetRoutesBetweenLocation from './sub-pages/GetRoutesBetweenLocation';

interface Route {
    id: number;
    name: string;
    coordinates: {
        x: number;
        y: number;
    };
    creationDate: string;
    from: {
        x: number;
        y: number;
        z: number;
        name: string;
    };
    to: {
        x: number;
        y: number;
        z: number;
        name: string;
    };
    distance: number;
}

interface ApiResponse {
    content: Route[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}

function App() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponse = await getRoutes();
            if (response && response.content) {
                setRoutes(response.content);
            }
        } catch (err) {
            setError('Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoute = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRouteById(id);
            fetchRoutes();
        } catch (err) {
            setError('Failed to delete route');
        } finally {
            setLoading(false);
        }
    };

    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const actions: { [key: string]: string } = {
        addRoute: 'Добавить маршрут',
        getMinRoute: 'Получить минимальный маршрут',
        getRouteWithDistance: 'Получить маршрут с расстоянием',
        getRoutesBetweenLocation: 'Получить маршруты между локациями',
    };

    const handleButtonClick = (action: keyof typeof actions) => {
        setSelectedAction(action as string);
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

    return (
        <div className="App">
            <header className="App-header">
                <h2>Маршруты</h2>
                <p>Тут будет таблица с маршрутами. В каждой строке 2 кнопки: подробнее и удалить</p>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <ul>
                    {routes.map(route => (
                        <li key={route.id}>
                            {route.from.name} to {route.to.name} - {route.distance} km
                            <button onClick={() => handleDeleteRoute(route.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div>
                        {Object.keys(actions).map((key) => (
                            <button key={key} onClick={() => handleButtonClick(key as keyof typeof actions)}>
                                {actions[key]}
                            </button>))}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        {renderContent()}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
