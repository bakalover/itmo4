// src/components/EditRoute.tsx
import React, {useState, useEffect} from 'react';
import {updateRouteById} from '../api';
import {Route} from "../model/types";
import {RenderInput} from './RenderInput';

interface State {
    route: Route;
}

const EditRoute: React.FC<{ route: Route; onSave: () => void; onCancel: () => void }> = ({
                                                                                             route,
                                                                                             onSave,
                                                                                             onCancel,
                                                                                         }) => {
    const [state, setState] = useState<State>({route});

    useEffect(() => {
        setState({route});
    }, [route]);

    const handleSave = async () => {
        try {
            await updateRouteById(state.route.id, state.route);
            onSave();
        } catch (error) {
            console.error('Error updating route:', error);
        }
    };

    return (
        <div>
            <h2>Редактировать маршрут</h2>
            {/*<RenderInput label="Название маршрута" path="route.name" state={state} setState={setState}/>*/}
            {/*<p>Координаты</p>*/}
            {/*<RenderInput label="X" path="route.coordinates.x" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Y" path="route.coordinates.y" state={state} setState={setState} type="number"/>*/}
            {/*<h3>Начальная точка</h3>*/}
            {/*<RenderInput label="Название" path="route.from.name" state={state} setState={setState}/>*/}
            {/*<RenderInput label="X" path="route.from.x" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Y" path="route.from.y" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Z" path="route.from.z" state={state} setState={setState} type="number"/>*/}
            {/*<h3>Конечная точка</h3>*/}
            {/*<RenderInput label="Название" path="route.to.name" state={state} setState={setState}/>*/}
            {/*<RenderInput label="X" path="route.to.x" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Y" path="route.to.y" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Z" path="route.to.z" state={state} setState={setState} type="number"/>*/}
            {/*<RenderInput label="Длина маршрута" path="route.distance" state={state} setState={setState} type="number"/>*/}
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={onCancel}>Отмена</button>
        </div>
    );
};

export default EditRoute;