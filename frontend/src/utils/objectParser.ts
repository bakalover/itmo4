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

export function parseObjectAndGenerateTemplate(currentObject: any, defaultValue: any): any {
    if (defaultValue !== true) console.log('template is: ', currentObject)
    let templateObject: any = {}
    for (const key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
            if (typeof currentObject[key] === 'object' && currentObject[key] !== null) {
                templateObject[key] = parseObjectAndGenerateTemplate(currentObject[key], defaultValue);
            } else {
                templateObject[key] = defaultValue;
            }
        } else {
            console.log('cur obj: ', currentObject, 'key: ', key)
        }
    }
    return templateObject
}


export function parseObjectAndSetValue(currentObject: any, valuePath: string, newValue: any): any {
    console.log('object was: ', currentObject)
    const path = valuePath.split('.');
    let parsed = currentObject;

    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!parsed[key] || typeof parsed[key] !== 'object') {
            parsed[key] = {};
        }
        parsed = parsed[key];
    }
    const finalKey = path[path.length - 1];
    parsed[finalKey] = newValue;
    console.log('now object is: ', currentObject)
    return currentObject;
}

export function parseObjectAndGetValue(currentObject: any, valuePath: string) {
    //console.log('Object was: ', currentObject);
    const path = valuePath.split('.');
    let parsed = currentObject;

    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!parsed[key]) {
            console.log('Found value is null')
            return null
        }
        parsed = parsed[key];
    }
    //console.log('Found value is: ', currentObject);
    return parsed[path[path.length - 1]]
}