const API_URL = 'https://localhost:35443/routes';

export const fetchMinRoute = async () => {
    try {
        const response = await fetch(`${API_URL}/min-id`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getRoutes = async (filters = '', sortingFields = '') => {
    console.log("Filters:", filters);
    console.log("Sorting fields:", sortingFields);

    try {
        let url = `${API_URL}`;

        const queryParams = [];

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
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Route not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching route by ID:', error);
        throw error;
    }
};

export const addRoute = async (route) => {
    try {
        console.log("going to add", route)
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(route),
        });
        if (!response.ok) {
            throw new Error('Failed to add route');
        }
    } catch (error) {
        console.error('Error adding route:', error);
        throw error;
    }
};

export const updateRouteById = async (id, route) => {
    try {
        console.log(id);
        console.log(route);

        const updatedRoute = {...route};

        delete updatedRoute.from.id;
        delete updatedRoute.to.id;

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRoute),
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

export const deleteRouteById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
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