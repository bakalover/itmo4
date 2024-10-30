// src/components/AddRoute.tsx
import React, {useState} from 'react';
import {addRoute, addRoutesWithId} from '../api';
import {Route, SimpleRoute} from "../model/types";
import {RenderInput} from './RenderInput';

interface State {
    isSimple: boolean;
    route: Omit<Route, 'id' | 'creationDate'>;
    simpleRoute: SimpleRoute;
}

const initialState: State = {
    isSimple: false,
    route: {
        name: 'Москва-Красноярск',
        coordinates: {x: 100, y: 200},
        from: {id: null, x: 10, y: 20, z: 30, name: 'Москва'},
        to: {id: null, x: 150, y: 250, z: 350, name: 'Красноярск'},
        distance: 5432,
    },
    simpleRoute: {from: 'Москва', to: 'Красноярск', distance: 5437},
};

const AddRoute: React.FC = () => {
    const [state, setState] = useState<State>(initialState);

    const handleAddRoute = async () => {
        try {
            if (state.isSimple) {
                await addRoutesWithId(state.simpleRoute.from, state.simpleRoute.to, state.simpleRoute.distance);
            } else {
                await addRoute(state.route);
            }
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    const handleModeSwitch = () => {
        setState((prevState) => ({...prevState, isSimple: !prevState.isSimple}));
    };

    return (
        <div>
            <h2>Добавить новый маршрут</h2>
            <button onClick={handleModeSwitch}>
                Переключить режим ввода
            </button>
            <br/>
            {state.isSimple ? (
                <>
                    <RenderInput label="Id начальной точки маршрута" path="simpleRoute.from" state={state}
                                 setState={setState}/>
                    <RenderInput label="Id конечной точки маршрута" path="simpleRoute.to" state={state}
                                 setState={setState}/>
                    <RenderInput label="Длина маршрута" path="simpleRoute.distance" state={state} setState={setState}
                                 type="number"/>
                </>
            ) : (
                <>
                    <RenderInput label="Название маршрута" path="route.name" state={state} setState={setState}/>
                    <p>Координаты</p>
                    <RenderInput label="X" path="route.coordinates.x" state={state} setState={setState} type="number"/>
                    <RenderInput label="Y" path="route.coordinates.y" state={state} setState={setState} type="number"/>
                    <h3>Начальная точка</h3>
                    <RenderInput label="Название" path="route.from.name" state={state} setState={setState}/>
                    <RenderInput label="X" path="route.from.x" state={state} setState={setState} type="number"/>
                    <RenderInput label="Y" path="route.from.y" state={state} setState={setState} type="number"/>
                    <RenderInput label="Z" path="route.from.z" state={state} setState={setState} type="number"/>
                    <h3>Конечная точка</h3>
                    <RenderInput label="Название" path="route.to.name" state={state} setState={setState}/>
                    <RenderInput label="X" path="route.to.x" state={state} setState={setState} type="number"/>
                    <RenderInput label="Y" path="route.to.y" state={state} setState={setState} type="number"/>
                    <RenderInput label="Z" path="route.to.z" state={state} setState={setState} type="number"/>
                    <RenderInput label="Длина маршрута" path="route.distance" state={state} setState={setState}
                                 type="number"/>
                </>
            )}
            <button onClick={handleAddRoute}>Добавить</button>
        </div>
    );
};

export default AddRoute;