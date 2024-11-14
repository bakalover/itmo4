import React, {useState} from "react";
import {RenderInputTemplate} from "../renders/RenderInputTemplate";
import BasicForm from "./BasicForm";
import {parseObjectAndGenerateTemplate, parseObjectAndGetValue, parseObjectAndSetValue} from "../../utils/objectParser";

interface SimpleRouteFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (number: boolean) => void
}

const FullRouteForm: React.FC<SimpleRouteFormProps> = ({
                                                           state,
                                                           setState,
                                                           onFormCorrectnessChange

                                                       }) => {

    const routeToPath = 'route.to'
    //then we add route, checkbox is always not checked
    //then we edit route, checkbox can be checked!

    const initialToStoredValue = parseObjectAndGetValue(state, routeToPath)
    const [routeToStoredValue, setRouteToStoredValue] = useState(initialToStoredValue)

    const initialCheckBox  = (routeToStoredValue === null)
    const [toCheckboxChecked, setToCheckboxChecked] = useState(initialCheckBox)




    const handleToCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('before: ', 'routeToStoredValue=', routeToStoredValue, 'checkbox=',  toCheckboxChecked)
        if (e.target.type === 'checkbox') {
            let newValue: any
            if (e.target.checked) {
                setRouteToStoredValue(parseObjectAndGetValue(state, routeToPath))
                console.log('going to preserve: ', routeToStoredValue)
                newValue = null
                setToCheckboxChecked(true)
            } else {
                //if restored === null (for example, edit route with to = null) -> genObject and fill all with nulls
                //take structure from "from" value
                if (routeToStoredValue === null) {
                    console.log('is null')
                    newValue = parseObjectAndGenerateTemplate(state.route.from, 1)
                    console.log('generated template: ', newValue)
                    setRouteToStoredValue(newValue)
                }
                else newValue = routeToStoredValue
                console.log('going to restore: ', newValue)
                setToCheckboxChecked(false)
            }
            let updatedToState = state
            updatedToState = parseObjectAndSetValue(updatedToState, routeToPath, newValue)
            console.log('updatedToState is', updatedToState)
            setState(updatedToState)
            console.log('Now route is: ', state.route)

        }
    }

    const renderTemplate = () => {
        return (
            <>
                <table className='addRoute'>
                    <tbody>
                    <tr>
                        <td colSpan={2}>
                            <RenderInputTemplate label="Название маршрута" path="route.name" inline={false}
                                                 filter={false}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <h3>Координаты</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <RenderInputTemplate label="X" path="route.coordinates.x"
                                                 inline={true} filter={false}/>
                        </td>
                        <td>
                            <RenderInputTemplate label="Y" path="route.coordinates.y"
                                                 inline={true} filter={false}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Начальная точка</h3>
                            <RenderInputTemplate label="Название" path="route.from.name" inline={false}
                                                 filter={false}/>
                            <RenderInputTemplate label="X" path="route.from.x" inline={true}
                                                 filter={false}/>
                            <RenderInputTemplate label="Y" path="route.from.y"
                                                 inline={true} filter={false}/>
                            <RenderInputTemplate label="Z" path="route.from.z"
                                                 inline={true} filter={false}/>
                        </td>
                        <td>
                            <h3>Конечная точка</h3>
                            <small>Не заполнять</small>
                            <input
                                id={"idToNullCheck"}
                                type={"checkbox"}
                                onChange={handleToCheckbox}
                                checked={toCheckboxChecked}
                            />
                            {!toCheckboxChecked && (<span><RenderInputTemplate label="Название" path="route.to.name"
                                                         inline={false} filter={false}/>
                                            <RenderInputTemplate label="X" path="route.to.x"
                                                                 inline={true} filter={false}/>
                                            <RenderInputTemplate label="Y" path="route.to.y"
                                                                 inline={true} filter={false}/>
                                            <RenderInputTemplate label="Z" path="route.to.z"
                                                                 inline={true} filter={false}/></span>)}

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <RenderInputTemplate label="Длина маршрута" path="route.distance"
                                                 inline={false} filter={false}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    }
    return (
        <BasicForm state={state} setState={setState} onFormCorrectnessChange={onFormCorrectnessChange}
                   renderTemplate={renderTemplate()}></BasicForm>
    )
}

export default FullRouteForm;