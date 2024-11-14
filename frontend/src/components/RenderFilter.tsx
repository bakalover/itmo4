import React, {useState} from 'react';
import {RenderInput} from "./RenderInput";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

interface RenderFilterProps {
    label: string;
    path: string;
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    inline: boolean;
    type?: "text" | "number" | "bigint";

}

export const RenderFilter: React.FC<RenderFilterProps> = ({
                                                              label,
                                                              path,
                                                              state,
                                                              setState,
                                                              type,
                                                              inline = false
                                                          }) => {

    const handleFilterCorrectionChange = (path : string, value : boolean) => {
        console.log('filter changed correction, but it doesnt matter')
    }

    const keys = (path + '.type').split('.');
    let value = state as any;

    for (const key of keys) {
        if (value[key] === null) continue
        value = value[key];
    }
    const changeFilterType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let filterType = e.target.value;
        if (filterType === '=' || filterType === '>' || filterType === '<') {
            return setState((prevState: any) => {
                let updatedState = {...prevState};
                console.log('old is', updatedState)
                let current = updatedState as any;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = filterType;
                return updatedState;
            });
        }

    }

    return (
        <span>
            <select
                onChange={changeFilterType}
            >
    <option value="=">{'='}</option>
    <option value="<">{'<'}</option>
    <option value=">">{'>'}</option>
  </select>
  <RenderInput
      label={label}
      path={path + '.val'}
      state={state}
      setState={setState}
      inline={inline}
      type={type}
      filter={true}
      onCorrectnessChange={handleFilterCorrectionChange}
  />
        </span>


    );
};