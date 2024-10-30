import { useState, useEffect } from 'react';
import { getRoutes, deleteRouteById } from '../api';
import { Route, ApiResponse } from '../model/types';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useRoutes() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async (filters?: string, sortingFields?: string, page?: number, size?: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponse = await getRoutes(filters, sortingFields, page, size);
            if (response) {
                setRoutes(response.routes);
                setNumberOfElements(response.numberOfElements);
                setTotalElements(response.totalElements);
                setTotalPages(response.totalPages);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const deleteRoute = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRouteById(id);
            await fetchRoutes();
        } catch (err) {
            setError('Failed to delete route');
        } finally {
            setLoading(false);
        }
    };

    return {
        routes,
        loading,
        error,
        numberOfElements,
        totalElements,
        totalPages,
        fetchRoutes,
        deleteRoute,
    };
}