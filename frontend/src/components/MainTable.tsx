import React, {useState} from "react";
import {UserRoute} from "../model/types";
import PaginationPanel from "./PaginationPanel";
import {RenderFilter} from "./renders/RenderFilter";
import {
    parseObjectAndGenerateTemplate,
    parseObjectAndGetAllValues,
    parseObjectAndGetValue, parseObjectAndSetValue
} from "../utils/objectParser";
import {Simulate} from "react-dom/test-utils";
import copy = Simulate.copy;

interface MainTableProps {
    routes: UserRoute[];
    loading: boolean;
    error: string | null;
    onEditRoute: (routeId: number) => void;
    onDeleteRoute: (id: number) => void;
    onAppliedFilters: (
        filters: string,
        sortingFields: string,
        pageSize: number,
        currentPage: number,
    ) => Promise<void>;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    onPageChanged: (
        filters: string,
        sortingFields: string,
        pageSize: number,
        currentPage: number,
    ) => Promise<void>;
    message: string | null;
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
                                                 totalPages,
                                                 onPageChanged,
                                                 message
                                             }) => {

    const [filters, setFilters] = useState({
        route: {
            id: {val: "", type: "="},
            name: {val: "", type: "="},
            coordinates: {
                x: {val: "", type: "="},
                y: {val: "", type: "="},
            },
            creationDate: {val: "", type: "="},
            from: {
                name: {val: "", type: "="},
                id: {val: "", type: "="},
                x: {val: "", type: "="},
                y: {val: "", type: "="},
                z: {val: "", type: "="},
            },
            to: {
                id: {val: "", type: "="},
                name: {val: "", type: "="},
                x: {val: "", type: "="},
                y: {val: "", type: "="},
                z: {val: "", type: "="},
            },
            distance: {val: "", type: "="},
        },
    });

    const [correctness, setCorrectness] = useState(parseObjectAndGenerateTemplate(filters.route, true))

    const [checkboxes, setCheckboxes] = useState({
        id: false,
        name: false,
        coordinates: {
            x: false,
            y: false,
        },
        creationDate: false,
        from: {
            id: false,
            name: false,
            x: false,
            y: false,
            z: false,
        },
        to: {
            id: false,
            name: false,
            x: false,
            y: false,
            z: false,
        },
        distance: false,
    });

    const [pageSize, setPageSize] = useState(10); // размер страницы
    const [currentPage, setCurrentPage] = useState(1); // текущая страница
    const [filterButtonBlocked, setFilterButtonBlocked] = useState(false)

    const checkFullCorrectness = (correctnessValues: boolean[]) => {
        for (let i = 0; i < correctnessValues.length; i++) {
            if (!correctnessValues[i]) return false;
        }
        return true;
    };

    const handleFilterCorrectness = (path: string, value: boolean) => {
        let curPath = path.substring(path.indexOf('.') + 1)
        console.log('filter correctness: ', path, value, curPath, parseObjectAndGetValue(correctness, curPath))
        let newCorrectness = parseObjectAndSetValue(correctness, curPath, value)
        setCorrectness(newCorrectness)
        let allData = parseObjectAndGetAllValues(correctness)
        setFilterButtonBlocked(!checkFullCorrectness(allData))
    }
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setCheckboxes((prevCheckboxes) => {
            const newCheckboxes = {...prevCheckboxes};
            const keys = name.split(".");
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

    const getTruthyPaths = (obj: any, prefix = "") => {
        let paths: string[] = [];
        for (const key in obj) {
            const value = obj[key];
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "object" && value !== null) {
                paths = paths.concat(getTruthyPaths(value, path));
            } else if (value) {
                paths.push(path);
            }
        }
        return paths;
    };

    const getFiltersForAPI = async () => {
        const dataArray = parseObjectAndGetAllValues(filters.route, true)
        const filtersArray = []
        for (let i = 0; i < dataArray.length; i += 2) {
            if (!dataArray[i].hasOwnProperty('value')) continue
            let val = dataArray[i].value
            let path = dataArray[i].path.substring(0, dataArray[i].path.lastIndexOf('.'))
            console.log(val, path)

            let type = dataArray[i + 1].value

            if (val === undefined || val === null || val === '' || val.trim().length === 0) continue
            if (type === "=") filtersArray.push(`${path}_eq_${val}`)
            else if (type === "<") filtersArray.push(`${path}_lt_${val}`)
            else if (type === ">") filtersArray.push(`${path}_gt_${val}`);
        }
        return filtersArray.join(",");
    };

    const getSortingForAPI = async () => {
        const sortingFieldsArray = getTruthyPaths(checkboxes);
        return sortingFieldsArray.join(",");
    };

    const applyFiltersAndSort = async () => {
        const filters = await getFiltersForAPI();
        const sorting = await getSortingForAPI();
        console.log(filters, sorting);
        await onAppliedFilters(filters, sorting, pageSize, currentPage);
    };

    const pageChangeHandler = async (pageSize: number, currentPage: number) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage)
        const filters = await getFiltersForAPI();
        const sorting = await getSortingForAPI();
        await onPageChanged(filters, sorting, pageSize, currentPage);
    };

    return (
        <div>
            <h3>Список текущих маршрутов</h3>
            {loading && <p>Загрузка...</p>}
            {error && <p>{error}</p>}{" "}
            {!loading && !error && <p className={'ok'}>{message === null ? '' : message}</p>}

            <div className={'Pagination'}>
                <PaginationPanel
                    totalPages={totalPages}
                    onPageChanged={pageChangeHandler}
                />
            </div>

            <div className={'Pagination'}>
                <table>
                    <tbody>
                    <tr>
                        <th>Фильтрация</th>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={applyFiltersAndSort}
                            disabled={filterButtonBlocked}>
                                Применить фильтры и сортировку
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p>
                    Выберите чекбокс у элемента, если хотите добавить его в сортировку
                </p>
                <div className={"mainTable"}>
                    <table>
                        <thead>
                        <tr>
                            <th rowSpan={2}>Номер</th>
                            <th rowSpan={2}>
                                ID
                                <br/>
                                <input
                                    type="checkbox"
                                    name="id"
                                    checked={checkboxes.id}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"ID"}
                                    path={"route.id"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th rowSpan={2}>
                                Название
                                <br/>
                                <input
                                    type="checkbox"
                                    name="name"
                                    checked={checkboxes.name}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Название"}
                                    path={"route.name"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th colSpan={2}>Координаты</th>
                            <th rowSpan={2}>
                                Дата создания
                                <br/>
                                <input
                                    type="checkbox"
                                    name="creationDate"
                                    checked={checkboxes.creationDate}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                            </th>
                            <th colSpan={5}>Откуда</th>
                            <th colSpan={5}>Куда</th>
                            <th rowSpan={2}>
                                Расстояние
                                <br/>
                                <input
                                    type="checkbox"
                                    name="distance"
                                    checked={checkboxes.distance}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Расстояние"}
                                    path={"route.distance"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th rowSpan={2}></th>
                        </tr>
                        <tr>
                            <th>
                                X<br/>
                                <input
                                    type="checkbox"
                                    name="coordinates.x"
                                    checked={checkboxes.coordinates?.x || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"X"}
                                    path={"route.coordinates.x"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Y<br/>
                                <input
                                    type="checkbox"
                                    name="coordinates.y"
                                    checked={checkboxes.coordinates?.y || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Y"}
                                    path={"route.coordinates.y"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Имя
                                <br/>
                                <input
                                    type="checkbox"
                                    name="from.name"
                                    checked={checkboxes.from?.name || false}
                                    onChange={handleCheckboxChange}

                                />
                                <br/>
                                <RenderFilter
                                    label={"Имя"}
                                    path={"route.from.name"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                id
                                <br/>
                                <input
                                    type="checkbox"
                                    name="from.id"
                                    checked={checkboxes.from?.id || false}
                                    onChange={handleCheckboxChange}

                                />
                                <br/>
                                <RenderFilter
                                    label={"id"}
                                    path={"route.from.id"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                X<br/>
                                <input
                                    type="checkbox"
                                    name="from.x"
                                    checked={checkboxes.from?.x || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"X"}
                                    path={"route.from.x"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Y<br/>
                                <input
                                    type="checkbox"
                                    name="from.y"
                                    checked={checkboxes.from?.y || false}
                                    onChange={handleCheckboxChange}

                                />
                                <br/>
                                <RenderFilter
                                    label={"Y"}
                                    path={"route.from.y"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Z<br/>
                                <input
                                    type="checkbox"
                                    name="from.z"
                                    checked={checkboxes.from?.z || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Z"}
                                    path={"route.from.z"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Имя
                                <br/>
                                <input
                                    type="checkbox"
                                    name="to.name"
                                    checked={checkboxes.to?.name || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Имя"}
                                    path={"route.to.name"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                id
                                <br/>
                                <input
                                    type="checkbox"
                                    name="to.id"
                                    checked={checkboxes.to?.id || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"id"}
                                    path={"route.from.id"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                X<br/>
                                <input
                                    type="checkbox"
                                    name="to.x"
                                    checked={checkboxes.to?.x || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"X"}
                                    path={"route.to.x"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Y<br/>
                                <input
                                    type="checkbox"
                                    name="to.y"
                                    checked={checkboxes.to?.y || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Y"}
                                    path={"route.to.y"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                            <th>
                                Z<br/>
                                <input
                                    type="checkbox"
                                    name="to.z"
                                    checked={checkboxes.to?.z || false}
                                    onChange={handleCheckboxChange}
                                />
                                <br/>
                                <RenderFilter
                                    label={"Z"}
                                    path={"route.to.z"}
                                    state={filters}
                                    setState={setFilters}
                                    inline={false}
                                    onCorrectnessChange={handleFilterCorrectness}
                                />
                            </th>
                        </tr>
                        </thead>
                        {/*  */}
                        {!error && (
                            <tbody>
                            {routes.map((route, index) => (
                                <tr key={route.id}>
                                    <td>{(index + 1) + ((currentPage - 1) * pageSize)}</td>
                                    <td>{route.id}</td>
                                    <td>{route.name}</td>
                                    <td>{route.coordinates.x?.toString()}</td>
                                    <td>{route.coordinates.y}</td>
                                    <td>{route.creationDate}</td>
                                    <td>{route.from.name}</td>
                                    <td>{route.from.id}</td>

                                    <td>{route.from.x?.toString()}</td>
                                    <td>{route.from.y}</td>
                                    <td>{route.from.z}</td>
                                    <td>{route.to?.name}</td>
                                    <td>{route.to?.id}</td>
                                    <td>{route.to?.x?.toString()}</td>
                                    <td>{route.to?.y}</td>
                                    <td>{route.to?.z}</td>
                                    <td>{route.distance?.toString()}</td>
                                    <td>
                                        <button onClick={() => onEditRoute(route.id)}>
                                            Подробнее
                                        </button>
                                        <button onClick={() => onDeleteRoute(route.id)}>
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        )}
                    </table>
                </div>

            </div>
        </div>
    );
};

export default MainTable;
