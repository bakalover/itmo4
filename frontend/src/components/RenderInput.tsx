import React, {useState} from 'react';
import {inputConstraints} from '../constants/fieldConstraints';

interface RenderInputProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    type?: "text" | "number" | "bigint";
    inline: boolean;
}

export const RenderInput: React.FC<RenderInputProps> = ({
                                                            label,
                                                            path,
                                                            state,
                                                            setState,
                                                            type = "text",
                                                            inline = false
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

    const {min, max, nullable, blankable, inputComment} = inputConstraints[path] || {};

    function processNull() {
        if (type === 'bigint' || type === 'number') return ''
        else return null;
    }

    function setNewState(newValue: any) {
        console.log("changing state ", newValue)
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
        console.log("handle event")
        if (e.target.type === 'checkbox') {
            setIsCheckboxChecked(e.target.checked);
            if (e.target.checked) {
                setCorrect(true);
                setNewState(null);
            } else {
                setCorrect(true);
                setNewState('');
            }
        } else {
            let inputValue: number | bigint | string | null;
            let isValid = true;
            console.log("change event")

            if (type === "number") {
                inputValue = e.target.valueAsNumber;
                isValid = (inputValue !== undefined && inputValue !== null && !isNaN(inputValue as number) && (inputValue >= Number(min) && inputValue <= Number(max)));
                if (isNaN(inputValue as number)) {
                    inputValue = null;
                    if (nullable) isValid = false;
                }
            } else if (type === "bigint") {
                inputValue = e.target.value;
                if (inputValue.length === 0) inputValue = null
                else {
                    try {
                        inputValue = BigInt(inputValue)
                    } catch (e) {
                        return
                    }
                }
                console.log(inputValue)

                isValid = (inputValue !== undefined && inputValue !== null && min !== undefined && max !== undefined && BigInt(inputValue) >= min && BigInt(inputValue) <= max);
                if (inputValue === null) isValid = nullable;
            } else if (type === "text") {
                inputValue = e.target.value;
                if (inputValue.length === 0 && !blankable) isValid = false;
            } else { //should be impossible
                inputValue = ''
            }

            setNewState(inputValue);
            setCorrect(isValid);
        }
    };

    let validationText: string;
    const barrierConst = -1000;
    if (type === "number" || type === "bigint") {
        if (min !== undefined && min <= barrierConst) {
            validationText = `Введите ${inputComment} число.`;
        }
        else if (min !== undefined) {
            // console.log(min, -barrierConst)
            validationText = `Введите ${inputComment} число не меньше ${min}.`;
        }
        else validationText = '';
        if (nullable !== undefined && nullable) validationText += '\nОставьте поле пустым, чтобы не заполнять значение.';
    } else {
        validationText = "Введите строку. Значение" + (!blankable ? " не " : " ") + "может быть пустым.";
        if (nullable !== undefined && nullable) validationText += '\nОтметьте чекбокс, чтобы не заполнять значение.';
    }

    const inputDisabled = isCheckboxChecked && type === "text" && nullable !== undefined && nullable;

    return (
        <>
            {!correct && <span><small className='bad'>Некорректное значение</small><br/></span>}
            {!inline && (<div><label htmlFor={path}>{label}</label>{!nullable ? '*' : ''}<br/></div>)}
            {!(validationText.length === 0) && <small>{validationText}</small>}
            <br/>
            {inline && <label htmlFor={path}>{label}{!nullable ? '*' : ''}: </label>}
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
            {type === "text" && nullable !== undefined && nullable && (
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