import React, {useState, ReactElement, cloneElement} from "react";
import {
    parseObjectAndGenerateTemplate,
    parseObjectAndGetAllValues,
    parseObjectAndSetValue
} from "../../utils/objectParser";
import {RenderInput} from "../renders/RenderInput";
import {RenderInputTemplate} from "../renders/RenderInputTemplate";

interface BasicFormProps {
    state: any;
    setState: any;
    onFormCorrectnessChange: (isCorrect: boolean) => void;
    renderTemplate: ReactElement;
}


const BasicForm: React.FC<BasicFormProps> = ({
                                                 state,
                                                 setState,
                                                 onFormCorrectnessChange,
                                                 renderTemplate
                                             }) => {
    //TODO проверить, что всегда соблюдается инвариант --- маршрут, который мы достали -- валиден
    const [globalCorrectness, setGlobalCorrectness] = useState(parseObjectAndGenerateTemplate(state, true));

    const checkFullCorrectness = (correctnessValues: boolean[]) => {
        for (let i = 0; i < correctnessValues.length; i++) {
            if (!correctnessValues[i]) return false;
        }
        return true;
    };

    const onFormCorrectionChangeLocally = (path: string, value: boolean) => {
        let currentCorrectness = globalCorrectness;
        parseObjectAndSetValue(currentCorrectness, path, value);
        setGlobalCorrectness(currentCorrectness);
        let values = parseObjectAndGetAllValues(currentCorrectness);
        onFormCorrectnessChange(checkFullCorrectness(values));
    };

    const convertRenderTemplate = (node: ReactElement): ReactElement => {
        if (node.type === RenderInputTemplate) {
            const {label, path, inline, filter} = node.props;
            return (
                <RenderInput
                    label={label}
                    path={path}
                    state={state}
                    setState={setState}
                    inline={inline}
                    filter={filter}
                    onCorrectnessChange={onFormCorrectionChangeLocally}
                />
            );
        }

        if (node.props && node.props.children) {
            const children = React.Children.map(node.props.children, child => {
                if (React.isValidElement(child)) {
                    return convertRenderTemplate(child);
                }
                return child;
            });
            return cloneElement(node, {...node.props, children});
        }
        return node;
    };

    const renderInputs = () => {
        return convertRenderTemplate(renderTemplate);
    };

    return <>{renderInputs()}</>;
};

export default BasicForm;