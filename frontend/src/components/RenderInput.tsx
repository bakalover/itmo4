import React, {useState} from 'react';
import {inputConstraints} from '../constants/fieldConstraints';

interface RenderInputProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    type?: "text" | "number" | "bigint";
    inline: boolean;
    filter: boolean;
    onCorrectnessChange: (path : string, valid: boolean) => void
}

export const RenderInput: React.FC<RenderInputProps> = ({
                                                            label,
                                                            path,
                                                            state,
                                                            setState,
                                                            type = "text",
                                                            inline = false,
                                                            filter = false,
                                                            onCorrectnessChange
                                                        }) => {
    const keys = path.split('.');
    let value = state as any;
    const [correct, setCorrect] = useState(true);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    for (const key of keys) {
        // console.log(key)
        if (value[key] === null) continue
        value = value[key];
    }

    let {
        min,
        max,
        nullable,
        blankable,
        inputComment
    } = (filter ? (inputConstraints[path.substring(0, path.lastIndexOf('.'))] || {}) : (inputConstraints[path] || {}));
    if (filter) {
        nullable = true;
        blankable = true;
    }

    function handleCorrectnessChange(value: boolean) {
        setCorrect(value);
        console.log('changed correctness of value')
        onCorrectnessChange(path, value)
    }

    function processNull() {
        if (type === 'bigint' || type === 'number') return ''
        else return null;
    }

    function setNewState(newValue: any) {
        // console.log("changing state ", newValue)
        // console.log("testing filters now!")
        // console.log(state)
        // console.log(min + ' ' + max)
        return setState((prevState: any) => {
            let updatedState = {...prevState};
            let current = updatedState as any;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            if (newValue === null) newValue = processNull();
            else if (typeof newValue === 'bigint') newValue = newValue.toString();
            current[keys[keys.length - 1]] = newValue;
            return updatedState;
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log("handle event")
        if (e.target.type === 'checkbox') {
            setIsCheckboxChecked(e.target.checked);
            if (e.target.checked) {
                handleCorrectnessChange(true);
                setNewState(null);
            } else {
                handleCorrectnessChange(true);
                setNewState('');
            }
        } else {
            let inputValue: number | bigint | string | null;
            let isValid = true;
            console.log("change event type of: " + type)

            if (type === "number") {
                inputValue = e.target.valueAsNumber;
                console.log("as number is " + inputValue)
                isValid = (inputValue !== undefined && inputValue !== null && !isNaN(inputValue as number) && (inputValue >= Number(min) && inputValue <= Number(max)));
                if (isNaN(inputValue as number)) {
                    console.log("null here ", nullable, filter)
                    inputValue = null;
                    isValid = nullable;
                }
            } else if (type === "bigint") {
                inputValue = e.target.value;
                if (inputValue.length === 0) inputValue = null
                else {
                    try {
                        inputValue = BigInt(inputValue)
                        isValid = (inputValue !== undefined && inputValue !== null && min !== undefined && max !== undefined && BigInt(inputValue) >= min && BigInt(inputValue) <= max);
                        if (inputValue === null) isValid = nullable;
                    } catch (e) {
                        isValid = false
                    }
                }
            } else if (type === "text") {
                inputValue = e.target.value;
                if (inputValue.length === 0 && !blankable) isValid = false;
            } else { //should be impossible
                inputValue = ''
            }

            setNewState(inputValue);
            handleCorrectnessChange(isValid);
        }
    };

    let validationText: string;
    const barrierConst = -1000;
    if (type === "number" || type === "bigint") {
        if (min !== undefined && min <= barrierConst) {
            validationText = `Введите ${inputComment} число.`;
        } else if (min !== undefined) {
            validationText = `Введите ${inputComment} число не меньше ${min}.`;
        } else validationText = '';
        if (nullable !== undefined && nullable && !filter) validationText += '\nОставьте поле пустым, чтобы не заполнять значение.';
    } else {
        validationText = "Введите строку. Значение" + (!blankable ? " не " : " ") + "может быть пустым.";
        if (nullable !== undefined && nullable && !filter) validationText += '\nОтметьте чекбокс, чтобы не заполнять значение.';
    }
    if (filter) {
        validationText = '';
        label = '';
        inline = true;
    }

    const inputDisabled = isCheckboxChecked && type === "text" && nullable !== undefined && nullable;

    return (
        <>
            {!correct && <span><small className='bad'>Некорректное значение</small><br/></span>}
            {!inline && (<div><label htmlFor={path}>{label}</label>{!nullable ? '*' : ''}<br/></div>)}
            {!(validationText.length === 0) && <small>{validationText}</small>}
            <br/>
            {inline && <label htmlFor={path}>{label}{!nullable ? '*' : ''} </label>}
            {!isCheckboxChecked &&
                (<input
                    className={correct ? 'ok' : 'bad'}
                    id={path}
                    type={type}
                    value={(type === 'bigint' ? value?.toString() : value)}
                    onChange={handleChange}
                    disabled={inputDisabled}
                    // placeholder={label}
                />)}
            {isCheckboxChecked && <small><b>Не заполнять</b></small>}
            {type === "text" && nullable !== undefined && nullable && !filter && (
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
