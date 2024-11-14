import { useEffect, useState } from 'react';
import { deleteRouteById, getRoutes } from '../api';
import { ApiResponse, UserRoute } from '../model/types';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useRoutes() {
    const [routes, setRoutes] = useState<UserRoute[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async (filters?: string, sortingFields?: string, size?: number, page?: number) => {
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
            setMessage('Маршрут успешно удален')
            await deleteRouteById(id);
            await fetchRoutes();
            console.log("message is ", message)
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
        message
    };
}
