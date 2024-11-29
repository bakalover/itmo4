import {useState} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import "./App.css";
import MainTable from "./components/MainTable";
import {useRoutes} from "./hooks/useRoutes";
import {UserRoute} from "./model/types";
import AddRoute from "./sub-modules/AddRoute";
import EditRoute from "./sub-modules/EditRoute";
import GetMinRoute from "./sub-modules/GetMinRoute";
import GetRoutesWithDistance from "./sub-modules/GetRouteWithDistance";
import GetRoutesBetweenLocation from "./sub-modules/GetRoutesBetweenLocation";
import {getNavigatorService} from "./api";

function App() {
    const {
        routes,
        loading,
        error,
        numberOfElements,
        totalElements,
        totalPages,
        fetchRoutes,
        deleteRoute,
        message,
        getRouteId,
    } = useRoutes();
    const [editingRoute, setEditingRoute] = useState<UserRoute | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState(message);
    const handleEditRoute = async (id: number) => {
        console.log("edit route");
        //setInfoMessage(null)
        setEditingRoute(await getRouteId(id));
    };
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
            return (
                <EditRoute
                    route={editingRoute}
                    onSave={handleTableContentChange}
                    onCancel={handleCancelEdit}
                />
            );
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="App">
                            <header className="App-header">
                                <h2>Маршруты</h2>
                                <nav>
                                    <Link to="/add-new-route">
                                        <button>Добавить новый маршрут</button>
                                    </Link>
                                    <Link to="/min-route">
                                        <button>Получить минимальный маршрут</button>
                                    </Link>
                                    <Link to="/with-distance">
                                        <button>Получить маршрут с заданным расстоянием</button>
                                    </Link>
                                    <Link to="/between-location">
                                        <button>Получить маршруты между локациями</button>
                                    </Link>
                                </nav>

                                {!editingRoute && !selectedAction && (
                                    <div>
                                        <button onClick={getNavigatorService}>Тест</button>
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
                                            message={infoMessage}
                                        />
                                    </div>
                                )}

                                {(editingRoute || selectedAction) && renderContent()}
                                {(editingRoute || selectedAction) && (
                                    <button
                                        onClick={handleBackButtonClick}
                                        style={{marginTop: "20px"}}
                                    >
                                        Назад
                                    </button>
                                )}
                            </header>
                        </div>
                    }
                ></Route>
                <Route
                    path="add-new-route"
                    element={
                        <div className="Center">
                            <AddRoute onAddRoute={handleTableContentChange}/>
                        </div>
                    }
                />
                <Route
                    path="/min-route"
                    element={
                        <div className="Center">
                            <GetMinRoute/>
                        </div>
                    }
                />
                <Route
                    path="/with-distance"
                    element={
                        <div className="Center">
                            <GetRoutesWithDistance/>
                        </div>
                    }
                />
                <Route
                    path="/between-location"
                    element={
                        <div className="Center">
                            <GetRoutesBetweenLocation/>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
