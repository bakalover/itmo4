import React, { useState, useEffect } from 'react';
import { updateRouteById } from '../api';

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

interface State {
    route: Route;
}

const EditRoute: React.FC<{ route: Route; onSave: () => void; onCancel: () => void }> = ({
                                                                                             route,
                                                                                             onSave,
                                                                                             onCancel,
                                                                                         }) => {
    const [state, setState] = useState<State>({ route });

    useEffect(() => {
        setState({ route });
    }, [route]);

    const handleSave = async () => {
        try {
            await updateRouteById(state.route.id, state.route);
            onSave();
        } catch (error) {
            console.error('Error updating route:', error);
        }
    };

    const handleNameChange = (value: string) => {
        setState((prevState) => ({
            ...prevState,
            route: { ...prevState.route, name: value },
        }));
    };

    const handleCoordinatesChange = (field: keyof Route['coordinates'], value: number) => {
        setState((prevState) => ({
            ...prevState,
            route: {
                ...prevState.route,
                coordinates: { ...prevState.route.coordinates, [field]: value },
            },
        }));
    };

    const handleFromChange = (field: keyof Route['from'], value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            route: {
                ...prevState.route,
                from: { ...prevState.route.from, [field]: value },
            },
        }));
    };

    const handleToChange = (field: keyof Route['to'], value: string | number) => {
        setState((prevState) => ({
            ...prevState,
            route: {
                ...prevState.route,
                to: { ...prevState.route.to, [field]: value },
            },
        }));
    };

    const handleDistanceChange = (value: number) => {
        setState((prevState) => ({
            ...prevState,
            route: { ...prevState.route, distance: value },
        }));
    };

    return (
        <div>
            <h2>Редактировать маршрут</h2>
            <label htmlFor="route-name">Название маршрута</label>
            <br />
            <input
                id="route-name"
                type="text"
                value={state.route.name}
                onChange={(e) => handleNameChange(e.target.value)}
            />
            <br />
            <p>Координаты</p>
            <label htmlFor="coordinates-x">X</label>
            <input
                id="coordinates-x"
                type="number"
                value={state.route.coordinates.x}
                onChange={(e) => handleCoordinatesChange('x', e.target.valueAsNumber)}
            />
            <label htmlFor="coordinates-y">Y</label>
            <input
                id="coordinates-y"
                type="number"
                value={state.route.coordinates.y}
                onChange={(e) => handleCoordinatesChange('y', e.target.valueAsNumber)}
            />
            <h3>Начальная точка</h3>
            <label htmlFor="from-name">Название</label>
            <br />
            <input
                id="from-name"
                type="text"
                value={state.route.from.name}
                onChange={(e) => handleFromChange('name', e.target.value)}
            />
            <br />
            <p>Координаты</p>
            <label htmlFor="from-x"> X</label>
            <input
                id="from-x"
                type="number"
                value={state.route.from.x}
                onChange={(e) => handleFromChange('x', e.target.valueAsNumber)}
            />
            <label htmlFor="from-y"> Y</label>
            <input
                id="from-y"
                type="number"
                value={state.route.from.y}
                onChange={(e) => handleFromChange('y', e.target.valueAsNumber)}
            />
            <label htmlFor="from-z"> Z</label>
            <input
                id="from-z"
                type="number"
                value={state.route.from.z}
                onChange={(e) => handleFromChange('z', e.target.valueAsNumber)}
            />
            <h3>Конечная точка</h3>
            <label htmlFor="to-name">Название</label>
            <br />
            <input
                id="to-name"
                type="text"
                value={state.route.to.name}
                onChange={(e) => handleToChange('name', e.target.value)}
            />
            <br />
            <p>Координаты</p>
            <label htmlFor="to-x"> X</label>
            <input
                id="to-x"
                type="number"
                value={state.route.to.x}
                onChange={(e) => handleToChange('x', e.target.valueAsNumber)}
            />
            <label htmlFor="to-y"> Y</label>
            <input
                id="to-y"
                type="number"
                value={state.route.to.y}
                onChange={(e) => handleToChange('y', e.target.valueAsNumber)}
            />
            <label htmlFor="to-z"> Z</label>
            <input
                id="to-z"
                type="number"
                value={state.route.to.z}
                onChange={(e) => handleToChange('z', e.target.valueAsNumber)}
            />
            <br />
            <label htmlFor="distance">Длина маршрута</label>
            <br />
            <input
                id="distance"
                type="number"
                value={state.route.distance}
                onChange={(e) => handleDistanceChange(e.target.valueAsNumber)}
            />
            <br/>
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={onCancel}>Отмена</button>
        </div>
    );
};

export default EditRoute;