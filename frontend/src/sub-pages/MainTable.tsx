import React, {useEffect, useState} from 'react';
import {Route} from '../types';

interface MainTableProps {
    routes: Route[];
    loading: boolean;
    error: string | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: number) => void;
    onAppliedFilters: (filters: string, sortingFields: string) => Promise<void>;
}

const MainTable: React.FC<MainTableProps> = ({
                                                 routes,
                                                 loading,
                                                 error,
                                                 onEditRoute,
                                                 onDeleteRoute,
                                                 onAppliedFilters
                                             }) => {
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

    const [uniqueIds, setUniqueIds] = useState<string[]>([]);
    const [uniqueNames, setUniqueNames] = useState<string[]>([]);
    const [uniqueFromNames, setUniqueFromNames] = useState<string[]>([]);
    const [uniqueToNames, setUniqueToNames] = useState<string[]>([]);

    const [checkboxes, setCheckboxes] = useState({
        id: false,
        name: false,
        coordinatesX: false,
        coordinatesY: false,
        creationDate: false,
        fromName: false,
        fromX: false,
        fromY: false,
        fromZ: false,
        toName: false,
        toX: false,
        toY: false,
        toZ: false,
        distance: false
    });

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
        const {name, value} = e.target;
        setFilters(prevFilters => ({...prevFilters, [name]: value}));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setCheckboxes(prevCheckboxes => ({...prevCheckboxes, [name]: checked}));
    };

    const applyFiltersAndSort = async () => {
        const filtersForApi = JSON.stringify(filters);
        const sortingFields = Object.entries(checkboxes)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .join(',');

        await onAppliedFilters(filtersForApi, sortingFields);
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
                        ID<br/>
                        <input type="checkbox" name="id" checked={checkboxes.id} onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="id" value={filters.id} onChange={handleFilterChange}>
                            <option value="">Выберите ID</option>
                            {uniqueIds.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </th>
                    <th rowSpan={2}>
                        Название<br/>
                        <input type="checkbox" name="name" checked={checkboxes.name} onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="name" value={filters.name} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th colSpan={2}>Координаты</th>
                    <th rowSpan={2}>
                        Дата создания<br/>
                        <input type="checkbox" name="creationDate" checked={checkboxes.creationDate}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="creationDate" value={filters.creationDate}
                               onChange={handleFilterChange}/>
                    </th>
                    <th colSpan={4}>Откуда</th>
                    <th colSpan={4}>Куда</th>
                    <th rowSpan={2}>
                        Расстояние<br/>
                        <input type="checkbox" name="distance" checked={checkboxes.distance}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="distance" value={filters.distance} onChange={handleFilterChange}/>
                    </th>
                    <th rowSpan={2}></th>
                </tr>
                <tr>
                    <th>
                        X<br/>
                        <input type="checkbox" name="coordinatesX" checked={checkboxes.coordinatesX}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="coordinatesX" value={filters.coordinatesX}
                               onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="coordinatesY" checked={checkboxes.coordinatesY}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="coordinatesY" value={filters.coordinatesY}
                               onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Имя<br/>
                        <input type="checkbox" name="fromName" checked={checkboxes.fromName}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="fromName" value={filters.fromName} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueFromNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X<br/>
                        <input type="checkbox" name="fromX" checked={checkboxes.fromX} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="fromX" value={filters.fromX} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="fromY" checked={checkboxes.fromY} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="fromY" value={filters.fromY} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Z<br/>
                        <input type="checkbox" name="fromZ" checked={checkboxes.fromZ} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="fromZ" value={filters.fromZ} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Имя<br/>
                        <input type="checkbox" name="toName" checked={checkboxes.toName}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="toName" value={filters.toName} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueToNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X<br/>
                        <input type="checkbox" name="toX" checked={checkboxes.toX} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="toX" value={filters.toX} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="toY" checked={checkboxes.toY} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="toY" value={filters.toY} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Z<br/>
                        <input type="checkbox" name="toZ" checked={checkboxes.toZ} onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="toZ" value={filters.toZ} onChange={handleFilterChange}/>
                    </th>
                </tr>
                </thead>
                <tbody>
                {routes.map((route) => (
                    <tr key={route.id}> {/* Use route.id as the key */}
                        <td>{route.id}</td>
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

            {/* Add a button to apply filters and sorting */}
            <div style={{marginTop: '20px', textAlign: 'center'}}>
                <button onClick={applyFiltersAndSort}>Применить фильтры и сортировку</button>
            </div>
        </div>
    );
};

export default MainTable;