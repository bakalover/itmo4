import React, {useState} from 'react';
import {addRoute, addRoutesWithId} from '../api';
import {Route, SimpleRoute} from "../model/types";
import {RenderInput} from './RenderInput';
import {getErrorMessage} from "../utils/getErrorMessage";

interface State {
    isSimple: boolean;
    route: Omit<Route, 'id' | 'creationDate'>;
    simpleRoute: SimpleRoute;
    errorMessage: string;
    errorThrown: boolean;
    isLoading: boolean;
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
    simpleRoute: {from: 1, to: 2, distance: 5437},
    errorMessage: '',
    errorThrown: false,
    isLoading: false
};

const AddRoute: React.FC = () => {
    const [state, setState] = useState<State>(initialState);
    const [isIdToNull, setIsIdToNull] = useState(false);

    const handleAddRoute = async () => {
        try {
            setState((prevState) => ({...prevState, isLoading: true})); // Set isLoading to true

            if (state.isSimple) {
                await addRoutesWithId(state.simpleRoute.from, state.simpleRoute.to, state.simpleRoute.distance);
            } else {
                await addRoute(state.route);
            }

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                errorThrown: false
            }));
        } catch (error) {
            let errorText = getErrorMessage(error)
            if (errorText.includes('Failed to fetch')) errorText = 'Сервер не доступен'
            else if (errorText.includes('NetworkError')) errorText = 'Нет подключения к сети'

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                errorThrown: true,
                errorMessage: 'Не удалось добавить маршрут!\n' + errorText
            }));
        }
    };

    const handleModeSwitch = () => {
        setState((prevState) => ({...prevState, isSimple: !prevState.isSimple}));
    };

    const changeIdToNull = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'checkbox' && e.target.id === 'idToNullCheck') {
            if (e.target.checked) {
                state.route.to = null
                setState(state)
            } else {
                state.route.to = {
                    id: null,
                    x: BigInt(0),
                    y: 0,
                    z: 0,
                    name: 'Красноярск'
                }
                setState(state)
            }
            setIsIdToNull(e.target.checked);
        }
    }

    return (
        <div>
            <h2>Добавить новый маршрут</h2>
            {state.isLoading ? (
                <p>Маршрут добавляется....</p>
            ) : (
                state.errorThrown && <p>{state.errorMessage}</p>
            )}
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
                                 type="number" inline={false}/>
                </>
            ) : (
                <>
                    <table className='addRoute'>
                        <tbody>
                        <tr>
                            <td colSpan={2}>
                                <RenderInput label="Название маршрута" path="route.name" state={state} type="text"
                                             setState={setState} inline={false}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <h3>Координаты</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <RenderInput label="X" path="route.coordinates.x" state={state} setState={setState}
                                             type="bigint" inline={true}/>
                            </td>
                            <td>
                                <RenderInput label="Y" path="route.coordinates.y" state={state} setState={setState}
                                             type="number" inline={true}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Начальная точка</h3>
                                <RenderInput label="Название" path="route.from.name" state={state} setState={setState}
                                             inline={false}/>
                                <RenderInput label="X" path="route.from.x" state={state} setState={setState}
                                             type="bigint" inline={true}/>
                                <RenderInput label="Y" path="route.from.y" state={state} setState={setState}
                                             type="number" inline={true}/>
                                <RenderInput label="Z" path="route.from.z" state={state} setState={setState}
                                             type="number" inline={true}/>
                            </td>
                            <td>
                                <h3>Конечная точка</h3>
                                <small>Не заполнять</small>
                                <input
                                    id={"idToNullCheck"}
                                    type={"checkbox"}
                                    checked={isIdToNull}
                                    onChange={changeIdToNull}
                                />
                                {!isIdToNull && (<span><RenderInput label="Название" path="route.to.name" state={state}
                                                                    setState={setState}
                                                                    inline={false}/>
                                <RenderInput label="X" path="route.to.x" state={state} setState={setState}
                                             type="bigint" inline={true}/>
                                <RenderInput label="Y" path="route.to.y" state={state} setState={setState}
                                             type="number" inline={true}/>
                                <RenderInput label="Z" path="route.to.z" state={state} setState={setState}
                                             type="number" inline={true}/></span>)}

                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <RenderInput label="Длина маршрута" path="route.distance" state={state}
                                             setState={setState}
                                             type="bigint" inline={false}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default AddRoute;