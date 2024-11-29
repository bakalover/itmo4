import React from "react";
import {RenderInputTemplate} from "../renders/RenderInputTemplate";
import BasicForm from "./BasicForm";

interface RoutesBetweenLocationsFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (number: boolean) => void
}

const RoutesBetweenLocationsForm: React.FC<RoutesBetweenLocationsFormProps> = ({
                                                                                   state,
                                                                                   setState,
                                                                                   onFormCorrectnessChange
                                                                               }) => {

    const renderTemplate = () => {
        return (<>
            <RenderInputTemplate
                label="Стартовая локация"
                path="from"
                inline={false}
                filter={false}
            />
            <br/>
            <RenderInputTemplate
                label="Конечная локация"
                path="to"
                inline={false}
                filter={false}
            />
        </>);
    }
    return (
        <BasicForm state={state} setState={setState} onFormCorrectnessChange={onFormCorrectnessChange}
                   renderTemplate={renderTemplate()}></BasicForm>
    )
}

export default RoutesBetweenLocationsForm;