// api.js
const API_URL = 'http://localhost:8080/routes';

export const getRoutes = async (filters) => {
    // TODO does not work without backend
    // const response = await fetch(`${API_URL}?${new URLSearchParams(filters)}`);
    //return await response.json();
    return [];
};

export const getRouteById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
};

export const addRoute = async (route) => {
    const response = await fetch(API_URL, {
        method: 'POST', // Changed from 'PUT' to 'POST' for adding a new resource
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(route),
    });
    return await response.json();
};

export const updateRouteById = async (id, route) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(route),
    });
    return await response.json();
};

export const deleteRouteById = async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
};