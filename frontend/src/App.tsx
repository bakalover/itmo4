import React, { useEffect, useState } from 'react';
import './App.css';
import { deleteRouteById, getRoutes } from './api';
import AddRoute from './sub-pages/AddRoute';
import GetMinRoute from './sub-pages/GetMinRoute';
import GetRouteWithDistance from './sub-pages/GetRouteWithDistance';
import GetRoutesBetweenLocation from './sub-pages/GetRoutesBetweenLocation';
import EditRoute from "./sub-pages/EditRoute";

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
    routes: Route[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}

function App() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [editingRoute, setEditingRoute] = useState<Route | null>(null);

    const handleEditRoute = (route: Route) => {
        setEditingRoute(route);
    };

    const handleCancelEdit = () => {
        setEditingRoute(null);
    };

    const handleSaveEdit = () => {
        fetchRoutes();
        setEditingRoute(null);
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response : ApiResponse = await getRoutes();
            console.log("resp is", response)
            if (response) {
                const content_only : Route[] = response.routes
                console.log(content_only)
                setRoutes(content_only);
                console.log("routes is ", routes)
            }
            else {
               // console.log("content: ", response.content)
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

        if (editingRoute) {
            return (
                <EditRoute
                    route={editingRoute}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            );
        }

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
                        <th rowSpan={2}>Номер</th>
                        <th rowSpan={2}>id</th>
                        <th rowSpan={2}>Название</th>
                        <th colSpan={2}>Координаты</th>
                        <th rowSpan={2}>Дата создания</th>
                        <th colSpan={4}>Откуда</th>
                        <th colSpan={4}>Куда</th>
                        <th rowSpan={2}>Расстояние</th>
                        <th rowSpan={2}>Действия</th>
                    </tr>
                    <tr>
                        <th>x</th>
                        <th>y</th>
                        <th>Имя</th>
                        <th>x</th>
                        <th>y</th>
                        <th>z</th>
                        <th>Имя</th>
                        <th>x</th>
                        <th>y</th>
                        <th>z</th>
                    </tr>
                    </thead>
                    <tbody>
                    {routes.map((route, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{route.id}</td>
                            <td>{route.name}</td>
                            <td>{route.coordinates.x}</td>
                            <td>{route.coordinates.y}</td>
                            <td>{route.creationDate}</td>
                            <td>{route.from.name}</td>
                            <td>{route.from.x}</td>
                            <td>{route.from.y}</td>
                            <td>{route.from.z}</td>
                            <td>{route.to.name}</td>
                            <td>{route.to.x}</td>
                            <td>{route.to.y}</td>
                            <td>{route.to.z}</td>
                            <td>{route.distance}</td>

                            <td>
                                <button onClick={() => handleEditRoute(route)}>Подробнее</button>
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
