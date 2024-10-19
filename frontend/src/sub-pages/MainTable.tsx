import React, {useEffect, useState} from 'react';
import {Route} from '../types';

interface MainTableProps {
    routes: Route[];
    loading: boolean;
    error: string | null;
    onEditRoute: (route: Route) => void;
    onDeleteRoute: (id: number) => void;
    onAppliedFilters: (filters: string, sortingFields: string) => Promise<void>,
    numberOfElements: number,
    totalElements: number,
    totalPages: number

}

const MainTable: React.FC<MainTableProps> = ({
                                                 routes,
                                                 loading,
                                                 error,
                                                 onEditRoute,
                                                 onDeleteRoute,
                                                 onAppliedFilters,
                                                 numberOfElements,
                                                 totalElements,
                                                 totalPages
                                             }) => {
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        coordinates: {
            x: '',
            y: ''
        },
        creationDate: '',
        from: {
            name: '',
            x: '',
            y: '',
            z: ''
        },
        to: {
            name: '',
            x: '',
            y: '',
            z: ''
        },
        distance: ''
    });

    const [checkboxes, setCheckboxes] = useState({
        id: false,
        name: false,
        coordinates: {
            x: false,
            y: false
        },
        creationDate: false,
        from: {
            name: false,
            x: false,
            y: false,
            z: false
        },
        to: {
            name: false,
            x: false,
            y: false,
            z: false
        },
        distance: false
    });

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
        const {name, value} = e.target;
        setFilters(prevFilters => {
            const newFilters = {...prevFilters};
            const keys = name.split('.');
            let current: any = newFilters;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!(key in current)) current[key] = {};
                current = current[key];
            }
            current[keys[keys.length - 1]] = value;
            return newFilters;
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setCheckboxes(prevCheckboxes => {
            const newCheckboxes = {...prevCheckboxes};
            const keys = name.split('.');
            let current: any = newCheckboxes;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!(key in current)) current[key] = {};
                current = current[key];
            }
            current[keys[keys.length - 1]] = checked;
            return newCheckboxes;
        });
    };

    const getTruthyPaths = (obj: any, prefix = '') => {
        let paths: string[] = [];
        for (const key in obj) {
            const value = obj[key];
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                paths = paths.concat(getTruthyPaths(value, path));
            } else if (value) {
                paths.push(path);
            }
        }
        return paths;
    };

    const applyFiltersAndSort = async () => {
        const filtersArray: string[] = [];

        for (const key in filters) {
            const value = filters[key as keyof typeof filters];
            if (typeof value === 'object' && value !== null) {
                for (const subKey in value) {
                    const subValue = value[subKey as keyof typeof value];
                    if (subValue !== '') {
                        filtersArray.push(`${key}.${subKey}=${JSON.stringify(subValue)}`);
                    }
                }
            } else if (value !== '') {
                filtersArray.push(`${key}:${value}`);
            }
        }

        const filtersForApi = filtersArray.join(',');
        const sortingFieldsArray = getTruthyPaths(checkboxes);
        const sortingFields = sortingFieldsArray.join(',');

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
                        <input type="checkbox" name="coordinates.x" checked={checkboxes.coordinates?.x || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="coordinates.x" value={filters.coordinates?.x || ''}
                               onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="coordinates.y" checked={checkboxes.coordinates?.y || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="coordinates.y" value={filters.coordinates?.y || ''}
                               onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Имя<br/>
                        <input type="checkbox" name="from.name" checked={checkboxes.from?.name || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="from.name" value={filters.from?.name || ''} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueFromNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X<br/>
                        <input type="checkbox" name="from.x" checked={checkboxes.from?.x || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="from.x" value={filters.from?.x || ''} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="from.y" checked={checkboxes.from?.y || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="from.y" value={filters.from?.y || ''} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Z<br/>
                        <input type="checkbox" name="from.z" checked={checkboxes.from?.z || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="from.z" value={filters.from?.z || ''} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Имя<br/>
                        <input type="checkbox" name="to.name" checked={checkboxes.to?.name || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <select name="to.name" value={filters.to?.name || ''} onChange={handleFilterChange}>
                            <option value="">Выберите название</option>
                            {uniqueToNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </th>
                    <th>
                        X<br/>
                        <input type="checkbox" name="to.x" checked={checkboxes.to?.x || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="to.x" value={filters.to?.x || ''} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Y<br/>
                        <input type="checkbox" name="to.y" checked={checkboxes.to?.y || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="to.y" value={filters.to?.y || ''} onChange={handleFilterChange}/>
                    </th>
                    <th>
                        Z<br/>
                        <input type="checkbox" name="to.z" checked={checkboxes.to?.z || false}
                               onChange={handleCheckboxChange}/>
                        <br/>
                        <input type="text" name="to.z" value={filters.to?.z || ''} onChange={handleFilterChange}/>
                    </th>
                </tr>
                </thead>
                <tbody>
                {routes.map((route) => (
                    <tr key={route.id}>
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