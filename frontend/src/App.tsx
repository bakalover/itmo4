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
            const response : ApiResponse = await getRoutes();
            if (response && response.content) {
                console.log("responce ", response)
                console.log("responce content: ", response.content)
                const content_only : Route[] = response.content
                console.log("content array is: ", content_only)
                setRoutes(content_only);
                console.log("routes is ", routes)
            }
            else {
                console.log("content: ", response.content)
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
        addRoute: 'Добавить новый маршрут в хранилище',
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
                {loading && <p>Загрузка...</p>}
                {error && <p>Ошибка: {error}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Маршрут</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {routes.map((route, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{JSON.stringify(route)}</td>
                            <td>
                                <button>Подробнее</button>
                                <button>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{textAlign: 'center', marginTop: '50px'}} className="menu">
                    <div>
                        {Object.keys(actions).map((key) => (
                            <button key={key} onClick={() => handleButtonClick(key as keyof typeof actions)}>
                                {actions[key]}
                            </button>))}
                    </div>
                    <div style={{marginTop: '20px'}}>
                        {renderContent()}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
