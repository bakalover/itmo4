import React, {useState} from 'react';
import {addRoute, addRoutesWithId} from '../api';
import {Route, SimpleRoute} from "../model/types";
import {RenderInput} from '../components/RenderInput';
import {getErrorMessage} from "../utils/getErrorMessage";
import RouteForm from "../components/RouteForm";

interface State {
    isSimple: boolean;
    route: Omit<Route, 'id' | 'creationDate'>;
    simpleRoute: SimpleRoute;
    errorMessage: string;
    isErrorThrown: boolean;
    isLoading: boolean;
    isSuccessAdd: boolean;
}

const initialState: State = {
    isSimple: false,
    route: {
        name: 'Москва-Красноярск',
        coordinates: {x: BigInt(100), y: 200},
        from: {id: null, x: BigInt(10), y: 20, z: 30, name: 'Москва'},
        to: {id: null, x: BigInt(150), y: 250, z: 350, name: 'Красноярск'},
        distance: BigInt(5432),
    },
    simpleRoute: {from: 1, to: 2, distance: BigInt(5432)},
    errorMessage: '',
    isErrorThrown: false,
    isLoading: false,
    isSuccessAdd: false
};

const AddRoute: React.FC = () => {
    const [state, setState] = useState<State>(initialState);

    const handleAddRoute = async () => {
        try {
            setState((prevState) => ({...prevState,
                isLoading: true,
                isErrorThrown : false,
                isSuccessAdd : false
            }));

            if (state.isSimple) {
                await addRoutesWithId(state.simpleRoute.from, state.simpleRoute.to, state.simpleRoute.distance);
            } else {
                await addRoute(state.route);
            }

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                isErrorThrown: false,
                isSuccessAdd: true
            }));
        } catch (error) {
            let errorText = getErrorMessage(error)

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                isErrorThrown: true,
                errorMessage: 'Не удалось добавить маршрут!\n' + errorText,
                isSuccessAdd: false
            }));
        }
    };

    const handleModeSwitch = () => {
        setState((prevState) => ({...prevState, isSimple: !prevState.isSimple}));
    };

    return (
        <div>
            <h2>Добавить новый маршрут</h2>
            {state.isLoading && <p>Маршрут добавляется....</p>}
            {state.isErrorThrown && <p><b>{state.errorMessage}</b></p>}
            {state.isSuccessAdd && <p className={'success'}><b>Маршрут успешно добавлен!</b></p>}

            <button onClick={handleModeSwitch} className='addRoute'>
                Переключить режим ввода
            </button>
            <button onClick={handleAddRoute} className='addRoute'>Добавить</button>

            <br/>
            <p>Символом * помечены обязательные к заполнению поля</p>
            {state.isSimple ? (
                <>
                    <RenderInput label="Id начальной точки маршрута" path="simpleRoute.from" state={state}
                                 setState={setState} inline={false}/>
                    <RenderInput label="Id конечной точки маршрута" path="simpleRoute.to" state={state}
                                 setState={setState} inline={false}/>
                    <RenderInput label="Длина маршрута" path="simpleRoute.distance" state={state} setState={setState}
                                 type="bigint" inline={false}/>
                </>
            ) : (
               <RouteForm state={state} setState={setState}></RouteForm>
            )}
        </div>
    );
};

export default AddRoute;