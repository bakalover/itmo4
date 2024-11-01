const CORE_URL = 'https://localhost:35443/routes';
const NAVIGATOR_URL = 'http://desktop-6saablk:8080/navigator-1.0-SNAPSHOT/navigator';

export const fetchMinRoute = async () => {
    try {
        const response = await fetch(`${CORE_URL}/min-id`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getRoutes = async (filters = '', sortingFields = '', page = 0, size = 10) => {
    console.log("Filters:", filters);
    console.log("Sorting fields:", sortingFields);
    console.log("Page:", page);
    console.log("Size:", size);

    // Validation for page and size
    if (!Number.isInteger(page) || page < 0) {
        console.error("Page must be a non-negative integer");
        throw new Error("Page must be a non-negative integer");
    }

    if (!Number.isInteger(size) || size < 1) {
        console.error("Size must be a positive integer");
        throw new Error("Size must be a positive integer");
    }

    try {
        let url = `${CORE_URL}`;

        const queryParams = [];

        queryParams.push(`page=${page}`);
        queryParams.push(`size=${size}`);

        if (filters) {
            queryParams.push(`filter=${encodeURIComponent(filters)}`);
        }

        if (sortingFields) {
            queryParams.push(`sort=${encodeURIComponent(sortingFields)}`);
        }


        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        console.log("Request URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Список маршрутов пуст! Добавьте первый маршрут, чтобы он отобразился в таблице');
            } else {
                throw new Error(`Ошибка при получении маршрутов: ${response.status} ${response.statusText}`);
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching routes:', error);
        throw error;
    }
};

export const getRouteById = async (id) => {
    try {
        const response = await fetch(`${CORE_URL}/${id}`);
        if (!response.ok) {

        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching route by ID:', error);
        throw error;
    }
};

export const addRoutesWithId = async (idTo, idFrom, distance) => {
    console.log("going to add", idTo, idFrom, distance)
    try {
        const response = await fetch(`${NAVIGATOR_URL}/route/add/${idFrom}/${idTo}/${distance}`, {
            method: 'POST'
        });
        if (response.ok) return response;
        else throw Error('AAA')
    } catch (error) {
        console.error('Error adding route with IDs:', error);
        throw error;
    }
}

const serializeBigInt = (obj) => {
    return JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    );
};


export const addRoute = async (route) => {
    console.log("going to add", route)
    const response = await fetch(CORE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: serializeBigInt(route),
    });
    if (response.status === 200) return response;
    else if (response.status === 400) throw new Error('Некорректные входные данные: ' + await response.text());
    else if (response.status === 409) throw new Error('Маршрут с id = ' + route.id.toString() + 'уже существует');
    else {
        throw new Error('Внутренняя ошибка сервера!')
    }
};

export const updateRouteById = async (id, route) => {
    try {
        console.log(id);
        console.log(route);

        const updatedRoute = {...route};

        delete updatedRoute.from.id;
        delete updatedRoute.to.id;

        const response = await fetch(`${CORE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: serializeBigInt(updatedRoute),
        });
        if (!response.ok) {
            throw new Error('Failed to update route');
        }
        return response
    } catch (error) {
        console.error('Error updating route:', error);
        throw error;
    }
};

export const getRoutesWithDistanceGreater = async (distance) => {
    try {
        const response = await fetch(`${CORE_URL}/distance/greater/${distance}`);

        if (!response.ok) {
            throw new Error("Маршрутов с большим чем заданным расстоянием нет");
        }
        return await response.json();
    } catch (error) {
        console.log("greater distance route find error:", error);
        throw error;
    }
};

export const getRoutesWithDistanceCount = async (distance) => {
    try {
        const response = await fetch(`${CORE_URL}/distance/count/${distance}`);

        if (!response.ok) {
            throw new Error("Маршрутов с заданным расстоянием нет");
        }
        return response;
    } catch (error) {
        console.log("equal route find error:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};


export const deleteRouteById = async (id) => {
    try {
        const response = await fetch(`${CORE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete route');
        }
    } catch (error) {
        console.error('Error deleting route:', error);
        throw error;
    }
};