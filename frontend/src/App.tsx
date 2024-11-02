import React, {useState} from 'react';
import './App.css';
import {useRoutes} from './hooks/useRoutes';
import AddRoute from './sub-modules/AddRoute';
import GetMinRoute from './sub-modules/GetMinRoute';
import GetRouteWithDistance from './sub-modules/GetRouteWithDistance';
import GetRoutesBetweenLocation from './sub-modules/GetRoutesBetweenLocation';
import EditRoute from './sub-modules/EditRoute';
import MainTable from './components/MainTable';
import ActionMenu from './components/ActionMenu';
import {Route} from './model/types';

function App() {
    const {routes, loading, error, numberOfElements, totalElements, totalPages, fetchRoutes, deleteRoute} = useRoutes();
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const actions = {
        addRoute: 'Добавить новый маршрут в хранилище',
        getMinRoute: 'Получить минимальный маршрут',
        getRouteWithDistance: 'Получить маршрут с расстоянием',
        getRoutesBetweenLocation: 'Получить маршруты между локациями',
    };

    const handleEditRoute = (route: Route) => setEditingRoute(route);
    const handleCancelEdit = () => setEditingRoute(null);
    const handleTableContentChange = () => {
        fetchRoutes();
    };

    const handleBackButtonClick = () => {
        setSelectedAction(null);
        setEditingRoute(null);
    };

    const renderContent = () => {
        if (editingRoute) {
            return <EditRoute route={editingRoute} onSave={handleTableContentChange} onCancel={handleCancelEdit}/>;
        }

        switch (selectedAction) {
            case 'addRoute':
                return <AddRoute onAddRoute={handleTableContentChange}/>;
            case 'getMinRoute':
                return <GetMinRoute/>;
            case 'getRouteWithDistance':
                return <GetRouteWithDistance/>;
            case 'getRoutesBetweenLocation':
                return <GetRoutesBetweenLocation/>;
            default:
                return null;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h2>Маршруты</h2>
                {!editingRoute && !selectedAction && <ActionMenu actions={actions} onActionSelect={setSelectedAction}/>}
                {!editingRoute && !selectedAction && (
                    <MainTable
                        routes={routes}
                        loading={loading}
                        error={error}
                        onEditRoute={handleEditRoute}
                        onDeleteRoute={deleteRoute}
                        onAppliedFilters={fetchRoutes}
                        numberOfElements={numberOfElements}
                        totalElements={totalElements}
                        totalPages={totalPages}
                        onPageChanged={fetchRoutes}
                    />
                )}

                {(editingRoute || selectedAction) && renderContent()}
                {(editingRoute || selectedAction) && (
                    <button onClick={handleBackButtonClick} style={{marginTop: '20px'}}>
                        Назад
                    </button>
                )}

            </header>
        </div>
    );
}

export default App;