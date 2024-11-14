export function parseObjectAndGetAllValues(currentObject: any): any[] {
    const values: any[] = [];
    for (const key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
            if (typeof currentObject[key] === 'object') {
                const nestedValues = parseObjectAndGetAllValues(currentObject[key]);
                values.push(...nestedValues);
            } else {
                values.push(currentObject[key]);
            }
        }
    }
    return values;
}

export function parseObjectAndSetValue(currentObject: any, valuePath: string, newValue: any) {
    console.log('Object was: ', JSON.stringify(currentObject, null, 2));
    const path = valuePath.split('.');
    let parsed = currentObject;

    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!parsed[key]) {
            console.error("Non-existing key!")
            parsed[key] = {};
        }
        parsed = parsed[key];
    }
    parsed[path[path.length - 1]] = newValue;
    console.log('Now object is: ', JSON.stringify(currentObject, null, 2));
}