import React, {useState, useEffect} from 'react';
import {updateRouteById} from '../api';
import {UserRoute} from "../model/types";
import FullRouteForm from "../components/forms/FullRouteForm";
import {getErrorMessage} from "../utils/getErrorMessage";

interface State {
    route: UserRoute;
    errorMessage: string;
    isErrorThrown: boolean;
    isLoading: boolean;
    isSuccessEdit: boolean;
}


const EditRoute: React.FC<{ route: UserRoute; onSave: () => void; onCancel: () => void }> = ({
                                                                                             route,
                                                                                             onSave,
                                                                                             onCancel,
                                                                                         }) => {

    const [editButtonBlocked, setEditButtonBlocked] = useState(false)

    const handleFormCorrectionChange = (value: boolean) => {
        setEditButtonBlocked(!value)
    }
    const initialState: State = {
        route: route,
        errorMessage: '',
        isErrorThrown: false,
        isLoading: false,
        isSuccessEdit: false
    };
    const [state, setState] = useState<State>(initialState);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            route: route
        }));
    }, [route]);

    const handleSave = async () => {
        try {
            setState((prevState) => ({
                ...prevState,
                isLoading: true,
                isErrorThrown: false,
                isSuccessEdit: false
            }));
            await updateRouteById(state.route.id, state.route);
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                isErrorThrown: false,
                isSuccessEdit: true
            }));
            onSave();
        } catch (error) {
            let errorText = getErrorMessage(error);

            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                isErrorThrown: true,
                errorMessage: 'Не удалось отредактировать маршрут!\n' + errorText,
                isSuccessEdit: false
            }));
        }
    };

    return (
        <div>
            {state.isLoading && <p>Маршрут сохраняется....</p>}
            {state.isErrorThrown && <p><b>{state.errorMessage}</b></p>}
            {state.isSuccessEdit && <p className={'success'}><b>Маршрут успешно отредактирован!</b></p>}
            <h2>Редактировать маршрут</h2>
            <button onClick={handleSave} disabled={editButtonBlocked} >Сохранить</button>
            <button onClick={onCancel}>Отмена</button>
            <FullRouteForm state={state} setState={setState}
                           onFormCorrectnessChange={handleFormCorrectionChange}></FullRouteForm>
        </div>
    );
};

export default EditRoute;
