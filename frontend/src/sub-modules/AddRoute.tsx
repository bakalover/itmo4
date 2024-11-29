import React, {useState} from 'react';
import {addRoute, addRoutesWithId} from '../api';
import {UserRoute, SimpleRoute} from "../model/types";
import {getErrorMessage} from "../utils/getErrorMessage";
import FullRouteForm from "../components/forms/FullRouteForm";
import SimpleRouteForm from "../components/forms/SimpleRouteForm";
import {useNavigate} from "react-router-dom";

interface State {
    isSimple: boolean;
    route: Omit<UserRoute, 'id' | 'creationDate'>;
    simpleRoute: SimpleRoute;
    errorMessage: string;
    isErrorThrown: boolean;
    isLoading: boolean;
    isSuccessAdd: boolean;
}

interface AddRouteProps {
    onAddRoute: () => void;

}

const initialState: State = {
    isSimple: false,
    route: {
        name: 'Москва-Красноярск',
        coordinates: {x: BigInt(100), y: 200},
        from: {id: null, x: BigInt(10), y: 20, z: 30, name: null},
        to: null,//{id: null, x: BigInt(150), y: 250, z: 350, name: 'Красноярск'},
        distance: BigInt(5432),
    },
    simpleRoute: {from: 1, to: 2, distance: BigInt(5432)},
    errorMessage: '',
    isErrorThrown: false,
    isLoading: false,
    isSuccessAdd: false,
};

const AddRoute: React.FC<AddRouteProps> = ({onAddRoute}) => {
    const [state, setState] = useState<State>(initialState);
    const [addButtonBlocked, setAddButtonBlocked] = useState(false)
    const navigate = useNavigate()
    const handleBack = () => {
      navigate("/");
    };

    const handleStateChange = (newState: State) => {
        setState((prevState) => ({
            ...prevState,
            newState
        }));
    }
    const handleAddRoute = async () => {
        try {
            setState((prevState) => ({
                ...prevState,
                isLoading: true,
                isErrorThrown: false,
                isSuccessAdd: false
            }));

            if (state.isSimple) {
                await addRoutesWithId(state.simpleRoute.from, state.simpleRoute.to, state.simpleRoute.distance);
                onAddRoute()
            } else {
                await addRoute(state.route);
                onAddRoute()
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

    const handleFormCorrectionChange = (value: boolean) => {
        console.log('form correctness changed! Now it is: ', value)
        setAddButtonBlocked(!value) //if false => block button
    }

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
            <button onClick={handleAddRoute} disabled={addButtonBlocked}>Добавить</button>

            <br/>
            <p>Символом * помечены обязательные к заполнению поля</p>
            {state.isSimple ? (
                <SimpleRouteForm state={state} setState={handleStateChange}
                                 onFormCorrectnessChange={handleFormCorrectionChange}/>
            ) : (
                <FullRouteForm state={state} setState={handleStateChange} onFormCorrectnessChange={handleFormCorrectionChange}/>
            )}
          <button onClick={handleBack} className="addRoute">
            Назад
          </button>
        </div>
    );
};

export default AddRoute;
