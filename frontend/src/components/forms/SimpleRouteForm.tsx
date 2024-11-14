import React from "react";
import {RenderInputTemplate} from "../renders/RenderInputTemplate";
import BasicForm from "./BasicForm";

interface SimpleRouteFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (number: boolean) => void
}

const SimpleRouteForm: React.FC<SimpleRouteFormProps> = ({
                                                             state,
                                                             setState,
                                                             onFormCorrectnessChange

                                                         }) => {

    const renderTemplate = () => {
        return (<>
            <RenderInputTemplate label="Id начальной точки маршрута" path="simpleRoute.from" inline={false}
                                 filter={false}/>
            <RenderInputTemplate label="Id конечной точки маршрута" path="simpleRoute.to"
                                 inline={false} filter={false}/>
            <RenderInputTemplate label="Длина маршрута" path="simpleRoute.distance"
                                 inline={false} filter={false}/>
        </>);
    }
    return (
        <BasicForm state={state} setState={setState} onFormCorrectnessChange={onFormCorrectnessChange}
                   renderTemplate={renderTemplate()}></BasicForm>
    )
}

export default SimpleRouteForm;