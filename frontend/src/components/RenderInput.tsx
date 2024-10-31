import React, { useState } from 'react';
import { inputConstraints } from '../constants/fieldConstraints';

interface RenderInputProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    type?: "text" | "number" | "bigint";
    inline: boolean
}

export const RenderInput: React.FC<RenderInputProps> = ({ label, path, state, setState, type = "text", inline = false }) => {
    const keys = path.split('.');
    let value = state as any;
    const [correct, setCorrect] = useState(true); // Make correct a state variable

    for (const key of keys) {
        value = value[key];
    }

    const { min, max } = inputConstraints[path] || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue: number | string | null;
        if (type === "number") inputValue = e.target.valueAsNumber;
        else inputValue = e.target.value;

        let isValid = true; // Use a temporary variable for validation

        if (type === "number" && inputValue !== undefined && inputValue !== null && !isNaN(inputValue as number) && (BigInt(inputValue) >= min && BigInt(inputValue) <= max)) {
            isValid = true;
        } else {
            isValid = false;
        }

        if(isNaN(inputValue as number)){
            inputValue = '';
            isValid = false;
        }

        setCorrect(isValid); // Update the correct state

        setState((prevState: any) => {
            let updatedState = { ...prevState };
            let current = updatedState as any;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = inputValue;
            return updatedState;
        });
    };

    let validationText: string;
    const barrierConst = -1000
    if (type === "number")
        if (min <= -barrierConst) validationText = "Введите целое число типа long"
        else validationText = `Введите число не меньше ${min}`;
    else
        validationText = "Введите строку. Значение не может быть пустым."
    return (
        <>
            {!correct && <p>Invalid input!!</p>} {/* Now this will work correctly */}
            {correct && <p>input is ok</p>}
            {!inline && (<div><label htmlFor={path}>{label}</label><br /></div>)}
            <small>{validationText}</small>
            <br />
            {inline && <label htmlFor={path}>{label}: </label>}
            <input className={correct ? 'ok' : 'bad'}
                id={path}
                type={type}
                value={value}
                onChange={handleChange}
            />
            <br />
        </>
    );
};