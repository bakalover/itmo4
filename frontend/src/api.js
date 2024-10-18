const API_URL = 'http://localhost:35080/routes';

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

export const getRoutes = async (filters = {}) => {
    try {
        const response = await fetch(`${API_URL}?${new URLSearchParams(filters)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch routes');
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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(route),
        });
        if (!response.ok) {
            throw new Error('Failed to add route');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding route:', error);
        throw error;
    }
};

export const updateRouteById = async (id, route) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(route),
        });
        if (!response.ok) {
            throw new Error('Failed to update route');
        }
        return await response.json();
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