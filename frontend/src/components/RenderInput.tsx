import React from 'react';
import {inputConstraints} from '../constants/fieldConstraints';

interface RenderInputProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    type?: "text" | "number";
}

export const RenderInput: React.FC<RenderInputProps> = ({label, path, state, setState, type = "text"}) => {
    const keys = path.split('.');
    let value = state as any;
    for (const key of keys) {
        value = value[key];
    }

    const {min, max} = inputConstraints[path] || {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = type === "number" ? e.target.valueAsNumber : e.target.value;
        if (type === "number" && inputValue !== undefined && (inputValue < min || inputValue > max)) {
            return; // Skip update if validation fails
        }
        setState((prevState: any) => {
            let updatedState = {...prevState};
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
            <label htmlFor={path}>{label}</label>
            <br/>
            <small>{validationText}</small>
            <br/>
            <input
                id={path}
                type={type}
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
            />
            <br/>
        </>
    );
};