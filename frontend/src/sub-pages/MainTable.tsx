import React, { useState, useEffect } from 'react';
import { Route } from '../types';

interface MainTableProps {
    routes: Route[];
    loading: boolean;
    error: string | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: number) => void;
}

const MainTable: React.FC<MainTableProps> = ({ routes, loading, error, onEditRoute, onDeleteRoute }) => {
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        coordinatesX: '',
        coordinatesY: '',
        creationDate: '',
        fromName: '',
        fromX: '',
        fromY: '',
        fromZ: '',
        toName: '',
        toX: '',
        toY: '',
        toZ: '',
        distance: ''
    });

    // Получаем уникальные значения для выпадающих списков
    const [uniqueIds, setUniqueIds] = useState<string[]>([]);
    const [uniqueNames, setUniqueNames] = useState<string[]>([]);
    const [uniqueFromNames, setUniqueFromNames] = useState<string[]>([]);
    const [uniqueToNames, setUniqueToNames] = useState<string[]>([]);


    useEffect(() => {
        const ids = Array.from(new Set(routes.map(route => route.id.toString())));
        const names = Array.from(new Set(routes.map(route => route.name)));
        const fromNames = Array.from(new Set(routes.map(route => route.from.name)));
        const toNames = Array.from(new Set(routes.map(route => route.to.name)));

        setUniqueIds(ids);
        setUniqueNames(names);
        setUniqueFromNames(fromNames);
        setUniqueToNames(toNames);
    }, [routes]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const applyFilters = () => {
        console.log('Applied filters:', filters);
    };

    return (
        <div>
            <h2>Маршруты</h2>
            {loading && <p>Загрузка...</p>}
            {error && <p>{error}</p>}

            <table>
                <thead>
                <tr>
                    <th rowSpan={2}>Номер</th>
                    <th rowSpan={2}>
                        ID:
                        <select name="id" value={filters.id} onChange={handleFilterChange}>
                            <option value="">Выберите ID</option>
                            {uniqueIds.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </th>
                    <th rowSpan={2}>
                        Название:
                        <select name="name" value={filters.name} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th colSpan={2}>Координаты</th>
                    <th rowSpan={2}>
                        Дата создания:
                        <input type="text" name="creationDate" value={filters.creationDate} onChange={handleFilterChange} />
                    </th>
                    <th colSpan={4}>Откуда</th>
                    <th colSpan={4}>Куда</th>
                    <th rowSpan={2}>
                        Расстояние:
                        <input type="text" name="distance" value={filters.distance} onChange={handleFilterChange} />
                    </th>
                    <th rowSpan={2}></th>
                </tr>
                <tr>
                    <th>
                        X:
                        <input type="text" name="coordinatesX" value={filters.coordinatesX} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Y:
                        <input type="text" name="coordinatesY" value={filters.coordinatesY} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Имя:
                        <select name="name" value={filters.fromName} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueFromNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X:
                        <input type="text" name="fromX" value={filters.fromX} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Y:
                        <input type="text" name="fromY" value={filters.fromY} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Z:
                        <input type="text" name="fromZ" value={filters.fromZ} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Имя:
                        <select name="name" value={filters.toName} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueToNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X:
                        <input type="text" name="toX" value={filters.toX} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Y:
                        <input type="text" name="toY" value={filters.toY} onChange={handleFilterChange} />
                    </th>
                    <th>
                        Z:
                        <input type="text" name="toZ" value={filters.toZ} onChange={handleFilterChange} />
                    </th>
                    <th>
                        <button type="button" onClick={applyFilters}>Применить</button>
                    </th>
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