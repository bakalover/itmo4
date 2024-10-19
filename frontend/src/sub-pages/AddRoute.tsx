import React, { useState } from 'react';
import {addRoute, addRoutesWithId, getRoutes} from '../api';

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

interface SimpleRoute {
    from: string;
    to: string;
    distance: number;
}

interface State {
    isSimple: boolean;
    routes: Route[];
    newRoute: SimpleRoute;
    detailedRoute: Omit<Route, 'id' | 'creationDate'>;
}

const initialState: State = {
    isSimple: false,
    routes: [],
    newRoute: { from: '', to: '', distance: 0 },
    detailedRoute: {
        name: '',
        coordinates: { x: 0, y: 0 },
        from: { x: 0, y: 0, z: 0, name: '' },
        to: { x: 0, y: 0, z: 0, name: '' },
        distance: 0,
    },
};

const AddRoute: React.FC = () => {
    const [state, setState] = useState(initialState);

    const fetchRoutes = async () => {
        try {
            const response = await getRoutes();
            setState((prevState) => ({ ...prevState, routes: response }));
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const handleAddRoute = async () => {
        try {
            if (state.isSimple) {
                await addRoutesWithId(state.newRoute.from, state.newRoute.to, state.newRoute.distance);
            } else {
                await addRoute(state.detailedRoute);
            }
            await fetchRoutes();
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    const handleModeSwitch = () => {
        setState((prevState) => ({ ...prevState, isSimple: !prevState.isSimple }));
    };

    const handleSimpleRouteChange = (field: keyof SimpleRoute, value: string | number) => {
        setState((prevState) => ({ ...prevState, newRoute: { ...prevState.newRoute, [field]: value } }));
    };

    const handleDetailedRouteChange = (field: 'name' | 'distance', value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            detailedRoute: {
                ...prevState.detailedRoute,
                [field]: value,
            },
        }));
    };

    const handleCoordinatesChange = (field: keyof Route['coordinates'], value: number) => {
        setState((prevState) => ({
            ...prevState,
            detailedRoute: {
                ...prevState.detailedRoute,
                coordinates: {
                    ...prevState.detailedRoute.coordinates,
                    [field]: value,
                },
            },
        }));
    };

    const handleFromChange = (field: keyof Route['from'], value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            detailedRoute: {
                ...prevState.detailedRoute,
                from: {
                    ...prevState.detailedRoute.from,
                    [field]: value,
                },
            },
        }));
    };

    const handleToChange = (field: keyof Route['to'], value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            detailedRoute: {
                ...prevState.detailedRoute,
                to: {
                    ...prevState.detailedRoute.to,
                    [field]: value,
                },
            },
        }));
    };

    return (
        <div>
            <h2>Добавить новый маршрут</h2>
            <button onClick={handleModeSwitch}>
                Переключить режим ввода
            </button>
            <br />
            {state.isSimple ? (
                <div>
                    <label htmlFor="route-source">Id начальной точки маршрута</label>
                    <br />
                    <input
                        id="route-source"
                        type="text"
                        placeholder="От"
                        value={state.newRoute.from}
                        onChange={(e) => handleSimpleRouteChange('from', e.target.value)}
                    />
                    <br />
                    <label htmlFor="route-destination">Id конечной точки маршрута:</label>
                    <br />
                    <input
                        id="route-destination"
                        type="text"
                        placeholder="До"
                        value={state.newRoute.to}
                        onChange={(e) => handleSimpleRouteChange('to', e.target.value)}
                    />
                    <br />
                    <label htmlFor="distance">Длина маршрута</label>
                    <br />
                    <input
                        id="distance"
                        type="number"
                        placeholder="1"
                        value={state.newRoute.distance}
                        onChange={(e) => handleSimpleRouteChange('distance', e.target.valueAsNumber)}
                    />
                </div>
            ) : (
                <div>
                    <label htmlFor="route-name">Название маршрута</label>
                    <br />
                    <input
                        id="route-name"
                        type="text"
                        placeholder="Москва-Питер"
                        value={state.detailedRoute.name}
                        onChange={(e) => handleDetailedRouteChange('name', e.target.value)}
                    />
                    <br />
                    <p>Координаты</p>
                    <label htmlFor="coordinates-x">X</label>
                    <input
                        id="coordinates-x"
                        type="number"
                        placeholder="X"
                        value={state.detailedRoute.coordinates.x}
                        onChange={(e) => handleCoordinatesChange('x', e.target.valueAsNumber)}
                    />
                    <label htmlFor="coordinates-y">Y</label>
                    <input
                        id="coordinates-y"
                        type="number"
                        placeholder="Y"
                        value={state.detailedRoute.coordinates.y}
                        onChange={(e) => handleCoordinatesChange('y', e.target.valueAsNumber)}
                    />
                    <h3>Начальная точка</h3>
                    <label htmlFor="from-name">Название</label>
                    <br />
                    <input
                        id="from-name"
                        type="text"
                        placeholder="Москва"
                        value={state.detailedRoute.from.name}
                        onChange={(e) => handleFromChange('name', e.target.value)}
                    />
                    <br />
                    <p>Координаты</p>
                    <label htmlFor="from-x"> X</label>
                    <input
                        id="from-x"
                        type="number"
                        value={state.detailedRoute.from.x}
                        onChange={(e) => handleFromChange('x', e.target.valueAsNumber)}
                    />
                    <label htmlFor="from-y"> Y</label>
                    <input
                        id="from-y"
                        type="number"
                        value={state.detailedRoute.from.y}
                        onChange={(e) => handleFromChange('y', e.target.valueAsNumber)}
                    />
                    <label htmlFor="from-z"> Z</label>
                    <input
                        id="from-z"
                        type="number"
                        value={state.detailedRoute.from.z}
                        onChange={(e) => handleFromChange('z', e.target.valueAsNumber)}
                    />
                    <h3>Конечная точка</h3>
                    <label htmlFor="to-name">Название</label>
                    <br />
                    <input
                        id="to-name"
                        type="text"
                        placeholder="Санкт-Петербург"
                        value={state.detailedRoute.to.name}
                        onChange={(e) => handleToChange('name', e.target.value)}
                    />
                    <br />
                    <p>Координаты</p>
                    <label htmlFor="to-x"> X</label>
                    <input
                        id="to-x"
                        type="number"
                        value={state.detailedRoute.to.x}
                        onChange={(e) => handleToChange('x', e.target.valueAsNumber)}
                    />
                    <label htmlFor="to-y"> Y</label>
                    <input
                        id="to-y"
                        type="number"
                        value={state.detailedRoute.to.y}
                        onChange={(e) => handleToChange('y', e.target.valueAsNumber)}
                    />
                    <label htmlFor="to-z"> Z</label>
                    <input
                        id="to-z"
                        type="number"
                        value={state.detailedRoute.to.z}
                        onChange={(e) => handleToChange('z', e.target.valueAsNumber)}
                    />
                    <br />
                    <label htmlFor="distance">Длина маршрута</label>
                    <br />
                    <input
                        id="distance"
                        type="number"
                        placeholder="700"
                        value={state.detailedRoute.distance}
                        onChange={(e) => handleDetailedRouteChange('distance', e.target.valueAsNumber)}
                    />
                </div>
            )}
            <button onClick={handleAddRoute}>Добавить</button>
        </div>
    );
};

export default AddRoute;