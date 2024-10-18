import React from 'react';
import { Route } from '../types';

interface MainTableProps {
    routes: Route[];
    loading: boolean;
    error: string | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: number) => void;
}

const MainTable: React.FC<MainTableProps> = ({ routes, loading, error, onEditRoute, onDeleteRoute }) => {
    return (
        <div>
            <h2>Маршруты</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p>{error}</p>}
            <table>
                <thead>
                <tr>
                    <th rowSpan={2}>Номер</th>
                    <th rowSpan={2}>id</th>
                    <th rowSpan={2}>Название</th>
                    <th colSpan={2}>Координаты</th>
                    <th rowSpan={2}>Дата создания</th>
                    <th colSpan={4}>Откуда</th>
                    <th colSpan={4}>Куда</th>
                    <th rowSpan={2}>Расстояние</th>
                    <th rowSpan={2}>Действия</th>
                </tr>
                <tr>
                    <th>x</th>
                    <th>y</th>
                    <th>Имя</th>
                    <th>x</th>
                    <th>y</th>
                    <th>z</th>
                    <th>Имя</th>
                    <th>x</th>
                    <th>y</th>
                    <th>z</th>
                </tr>
                </thead>
                <tbody>
                {routes.map((route, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{route.id}</td>
                        <td>{route.name}</td>
                        <td>{route.coordinates.x}</td>
                        <td>{route.coordinates.y}</td>
                        <td>{route.creationDate}</td>
                        <td>{route.from.name}</td>
                        <td>{route.from.x}</td>
                        <td>{route.from.y}</td>
                        <td>{route.from.z}</td>
                        <td>{route.to.name}</td>
                        <td>{route.to.x}</td>
                        <td>{route.to.y}</td>
                        <td>{route.to.z}</td>
                        <td>{route.distance}</td>
                        <td>
                            <button onClick={() => onEditRoute(route)}>Подробнее</button>
                            <button onClick={() => onDeleteRoute(route.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainTable;