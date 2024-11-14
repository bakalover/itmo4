import React, {useState} from "react";
import {RenderInput} from "./RenderInput";
import {RouteBoolean} from "../model/types";
import {rootCertificates} from "node:tls";
import {parseObjectAndGetAllValues, parseObjectAndSetValue} from "../utils/objectParser";

interface RouteFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (number: boolean) => void
}

interface correctnessState {
    route: RouteBoolean
}

const initialCorrectness: correctnessState = {
    route: {
        id: true,
        name: true,
        coordinates: {
            x: true,
            y: true,
        },
        creationDate: true,
        from: {
            id: true,
            name: true,
            x: true,
            y: true,
            z: true,
        },
        to: {
            id: true,
            name: true,
            x: true,
            y: true,
            z: true,
        },
        distance: true,
    }
}

const RouteForm: React.FC<RouteFormProps> = ({
                                                 state,
                                                 setState,
                                                 onFormCorrectnessChange

                                             }) => {
    const [globalCorrectness, setGlobalCorrectness] = useState(initialCorrectness);



    const checkFullCorrectness = (correctnessValues: boolean[]) => {
        for(let i = 0; i < correctnessValues.length; i++){
            if (!correctnessValues[i]) return false
        }
        return true
    }

    const onFormCorrectionChangeLocally = (path: string, value: boolean) => {
        console.log('new correctness in form: ', value, path)
        let currentCorrectness = globalCorrectness
        parseObjectAndSetValue(currentCorrectness, path, value)
        setGlobalCorrectness(currentCorrectness)
        let values = parseObjectAndGetAllValues(currentCorrectness)
        console.log('Values are: ', values)
        onFormCorrectnessChange(checkFullCorrectness(values))
    }

    const [isIdToNull, setIsIdToNull] = useState(false);
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

        <>
            <table className='addRoute'>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <RenderInput label="Название маршрута" path="route.name" state={state} type="text"
                                     setState={setState} inline={false} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
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
                                     type="bigint" inline={true} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
                    </td>
                    <td>
                        <RenderInput label="Y" path="route.coordinates.y" state={state} setState={setState}
                                     type="number" inline={true} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h3>Начальная точка</h3>
                        <RenderInput label="Название" path="route.from.name" state={state} setState={setState}
                                     inline={false} filter={false} onCorrectnessChange={onFormCorrectionChangeLocally}/>
                        <RenderInput label="X" path="route.from.x" state={state} setState={setState}
                                     type="bigint" inline={true} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
                        <RenderInput label="Y" path="route.from.y" state={state} setState={setState}
                                     type="number" inline={true} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
                        <RenderInput label="Z" path="route.from.z" state={state} setState={setState}
                                     type="number" inline={true} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
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
                                                            inline={false} filter={false}
                                                            onCorrectnessChange={onFormCorrectionChangeLocally}/>
                                <RenderInput label="X" path="route.to.x" state={state} setState={setState}
                                             type="bigint" inline={true} filter={false}
                                             onCorrectnessChange={onFormCorrectionChangeLocally}/>
                                <RenderInput label="Y" path="route.to.y" state={state} setState={setState}
                                             type="number" inline={true} filter={false}
                                             onCorrectnessChange={onFormCorrectionChangeLocally}/>
                                <RenderInput label="Z" path="route.to.z" state={state} setState={setState}
                                             type="number" inline={true} filter={false}
                                             onCorrectnessChange={onFormCorrectionChangeLocally}/></span>)}

                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <RenderInput label="Длина маршрута" path="route.distance" state={state}
                                     setState={setState}
                                     type="bigint" inline={false} filter={false}
                                     onCorrectnessChange={onFormCorrectionChangeLocally}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    )
}

export default RouteForm;
