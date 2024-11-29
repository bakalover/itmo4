import React from "react";
import {RenderInputTemplate} from "../renders/RenderInputTemplate";
import BasicForm from "./BasicForm";

interface RoutesWithDistanceFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (number: boolean) => void
}

const RoutesWithDistanceForm: React.FC<RoutesWithDistanceFormProps> = ({
                                                                           state,
                                                                           setState,
                                                                           onFormCorrectnessChange
                                                                       }) => {

    const renderTemplate = () => {
        return (<>
            <RenderInputTemplate
                label="Дистанция"
                path="distance"
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

export default RoutesWithDistanceForm;