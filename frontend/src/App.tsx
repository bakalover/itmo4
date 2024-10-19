import React, { useEffect, useState } from 'react';
import './App.css';
import { deleteRouteById, getRoutes } from './api';
import AddRoute from './sub-pages/AddRoute';
import GetMinRoute from './sub-pages/GetMinRoute';
import GetRouteWithDistance from './sub-pages/GetRouteWithDistance';
import GetRoutesBetweenLocation from './sub-pages/GetRoutesBetweenLocation';
import EditRoute from "./sub-pages/EditRoute";
import MainTable from './sub-pages/MainTable';
import { Route, ApiResponse } from './types';

function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

function App() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const actions: { [key: string]: string } = {
        addRoute: 'Добавить новый маршрут в хранилище',
        getMinRoute: 'Получить минимальный маршрут',
        getRouteWithDistance: 'Получить маршрут с расстоянием',
        getRoutesBetweenLocation: 'Получить маршруты между локациями',
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async (filters?: string, sortingFields?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponse = await getRoutes(filters, sortingFields);
            if (response) {
                setRoutes(response.routes);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

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

    const handleButtonClick = (action: keyof typeof actions) => {
        setSelectedAction(action as string);
    };

    const handleBackButtonClick = () => {
        setSelectedAction(null);
        setEditingRoute(null);
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
                {/* Conditionally render the MainTable based on whether a route is being edited or an action is selected */}
                {!editingRoute && !selectedAction && (
                    <MainTable
                        routes={routes}
                        loading={loading}
                        error={error}
                        onEditRoute={handleEditRoute}
                        onDeleteRoute={handleDeleteRoute}
                        onAppliedFilters={fetchRoutes}
                    />
                )}

                {/* Render the selected action content */}
                {(editingRoute || selectedAction) && renderContent()}

                {/* Render the menu and Back button when an action is selected or a route is being edited */}
                {(editingRoute || selectedAction) && (
                    <button onClick={handleBackButtonClick} style={{ marginTop: '20px' }}>
                        Назад
                    </button>
                )}

                {/* Render the action buttons only when the main table is visible */}
                {!editingRoute && !selectedAction && (
                    <div style={{ textAlign: 'center', marginTop: '50px' }} className="menu">
                        <div>
                            {Object.keys(actions).map((key) => (
                                <button key={key} onClick={() => handleButtonClick(key as keyof typeof actions)}>
                                    {actions[key]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;