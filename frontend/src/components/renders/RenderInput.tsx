import React, {useState} from 'react';
import {inputConstraints} from '../../constants/fieldConstraints';
import {parseObjectAndGetValue, parseObjectAndSetValue} from "../../utils/objectParser";
import bigDecimal from "js-big-decimal";
import {makeValidationLabel} from "../../utils/lableValidationHelper";

interface RenderInputProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    inline: boolean;
    filter: boolean;
    onCorrectnessChange: (path: string, valid: boolean) => void
}

export const RenderInput: React.FC<RenderInputProps> = ({
                                                            label,
                                                            path,
                                                            state,
                                                            setState,
                                                            inline = false,
                                                            filter = false,
                                                            onCorrectnessChange
                                                        }) => {
    const [correct, setCorrect] = useState(true);
    const initialCheckBox = (parseObjectAndGetValue(state, path) === null)
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(initialCheckBox);
    const [errorMessage, setErrorMessage] = useState('')

    const initialState = parseObjectAndGetValue(state, path)
    const [actualValue, setActualValue] = useState(initialState)
    const [prevValue, setPrevValue] = useState(actualValue) //need to restore old input after removing checkbox

    const curRef = (filter ? (inputConstraints[path.substring(0, path.lastIndexOf('.'))] || {}) : (inputConstraints[path] || {}))

    const curConst = {
        nullable: (filter ? true : curRef.nullable),
        blank_able: (filter ? true : curRef.blank_able),
        min: curRef.min,
        max: curRef.max,
        inputComment: curRef.inputComment,
        dataType: curRef.dataType

    }
    const numberRegex = /^-?\d+$|^-?\d+[,.]+\d+$/
    const integerRegex = /^-?\d+$/
    const floatRegex = /^-?\d+[,.]?\d{0,8}$/;


    function handleCorrectnessChange(value: boolean) {
        setCorrect(value);
        console.log('changed correctness of value', path, value)
        onCorrectnessChange(path, value)
    }

    function setNewState(newValue: any) {
        let newState = state
        newState = parseObjectAndSetValue(newState, path, newValue);
        setActualValue(newValue)
        setState(newState)
        console.log('new state is: ', state)

    }

    const handleCheckboxChange = (checked: boolean) => {
        console.log('checkbox change automatically??')
        setIsCheckboxChecked(checked);
        if (checked) {
            // actually must be same with value variable
            let oldValue = parseObjectAndGetValue(state, path)
            setPrevValue(oldValue)
            setNewState(null);
        } else {
            setNewState(prevValue);
        }
        handleCorrectnessChange(true);
    }

    const emptyValueCheck = (value: string) => {
        if (value.length === 0) {
            console.log("empty will be treated as null", curConst.nullable)
            if (!curConst.nullable) return [null, false, 'значение не может быть не задано']
            else return [null, true]
        } else if (value.trim().length === 0) {
            console.log("spaces will be treated as error, value.len=", value.length)
            return [value, false, 'строка не пуста и не содержит числовых значений']
        } else {
            console.log("value is not empty")
            return [value, true]
        }
    }

    const handleIntChange = (value: string) => {

        if (!(numberRegex.test(value))) {
            return [false, "введенное значение не является числом"];
        }
        if (!(integerRegex.test(value))) {
            return [false, "введенное значение не является целым"];
        }
        let intValue = BigInt(value.replace(',', '.'))
        if (intValue < Number(curConst.min)) {
            return [false, "введенное значение меньше минимально возможного"];
        }
        if (intValue > Number(curConst.max)) {
            return [false, "введенное значение больше максимально возможного"];
        }
        return [true]
    }

    const handleLongChange = (value: string) => {
        if (!(numberRegex.test(value))) {
            return [false, "введенное значение не является числом"];
        }
        if (!(integerRegex.test(value))) {
            return [false, "введенное значение не является целым"];
        }
        let bigintValue = BigInt(value.replace(',', '.'))
        if (bigintValue < curConst.min) {
            return [false, "введенное значение меньше минимально возможного"];
        }
        if (bigintValue > curConst.max) {
            return [false, "введенное значение больше максимально возможного"];
        }
        return [true]
    }

    const handleFloatChange = (value: string) => {
        if (!(numberRegex.test(value))) {
            return [false, "введенное значение не является числом"];
        }
        if (!(floatRegex.test(value))) {
            return [false, "точность float не более 8 символов после запятой"];
        }
        let floatValue = new bigDecimal(value.replace(',', '.'))

        if (floatValue.compareTo(curConst.min) < 0) {
            return [false, "введенное значение меньше минимально возможного"];
        }
        if (floatValue.compareTo(curConst.max) > 0) {
            return [false, "введенное значение больше максимально возможного"];
        }
        return [true]
    }

    const handleTextChange = (value: string) => {
        console.log("handle text: ", value)
        let emptyParse = emptyValueCheck(value)
        if (emptyParse[0] === null) {
            if (curConst.blank_able) return [true]
            else return [false, 'строка не может быть пуста']
        } else return [true] //assume what name " " is okayz
    }

    const saveChange = (parseResult: any[]) => {
        if (parseResult[1] === false && parseResult.length === 3) setErrorMessage(parseResult[2])
        else if (parseResult[1] === true) setErrorMessage('')
        console.log('going to set: ', parseResult)
        setNewState((parseResult[0] === null ? parseResult[0] : parseResult[0].toString()));
        handleCorrectnessChange(parseResult[1]);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('change')
        if (e.target.type === 'checkbox') handleCheckboxChange(e.target.checked)
        else {
            let parseResult: any;
            if (curConst.dataType === "text") parseResult = handleTextChange(e.target.value)
            else {
                parseResult = emptyValueCheck(e.target.value);
                if (parseResult[0] === null || parseResult[1] === false) {
                    saveChange(parseResult)
                    return;
                } else {
                    if (curConst.dataType === "int") parseResult = handleIntChange(e.target.value)
                    else if (curConst.dataType === "long") parseResult = handleLongChange(e.target.value)
                    else if (curConst.dataType === "float") parseResult = handleFloatChange(e.target.value)
                    else {
                        console.log(curConst.dataType)
                        console.error('Unknown type!')
                        return
                    }
                }
            }
            saveChange([e.target.value].concat(parseResult))
        }
    };


    let validationText = makeValidationLabel(curConst)
    if (filter) {
        validationText = '';
        label = '';
        inline = true;
    }

    const inputDisabled = isCheckboxChecked && curConst.dataType === "text" && curConst.nullable !== undefined && curConst.nullable;

    return (
        <>
            <p>{curConst.nullable}</p>
            {!correct && <span><small className='bad'>Некорректное значение: {errorMessage}</small><br/></span>}
            {!inline && (<div><label htmlFor={path}>{label}</label>{!curConst.nullable ? '*' : ''}<br/></div>)}
            {!(validationText.length === 0) && <small>{validationText}</small>}
            <br/>
            {inline && <label htmlFor={path}>{label}{!curConst.nullable ? '*' : ''} </label>}
            {!isCheckboxChecked &&
                (<input
                    className={correct ? 'ok' : 'bad'}
                    id={path}
                    value={(actualValue === null ? '' : curConst.dataType === 'long' ? actualValue.toString() : actualValue)}
                    onChange={handleChange}
                    disabled={inputDisabled}
                    // placeholder={label}
                />)}
            {isCheckboxChecked && <small><b>Не заполнять</b></small>}
            {curConst.dataType === "text" && curConst.nullable !== undefined && curConst.nullable && !filter && (
                <input
                    type={"checkbox"}
                    checked={isCheckboxChecked}
                    onChange={handleChange}
                />
            )}
            <br/>
        </>
    );
};
