import React, { useState } from "react";
import { UserRoute } from "../model/types";
import PaginationPanel from "./PaginationPanel";
import { RenderFilter } from "./RenderFilter";

interface MainTableProps {
  routes: UserRoute[];
  loading: boolean;
  error: string | null;
  onEditRoute: (route: UserRoute) => void;
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
  message,
}) => {
  const [filters, setFilters] = useState({
    route: {
      id: { val: "", type: "=" },
      name: { val: "", type: "=" },
      coordinates: {
        x: { val: "", type: "=" },
        y: { val: "", type: "=" },
      },
      creationDate: { val: "", type: "=" },
      from: {
        name: { val: "", type: "=" },
        id: { val: "", type: "=" },
        x: { val: "", type: "=" },
        y: { val: "", type: "=" },
        z: { val: "", type: "=" },
      },
      to: {
        id: { val: "", type: "=" },
        name: { val: "", type: "=" },
        x: { val: "", type: "=" },
        y: { val: "", type: "=" },
        z: { val: "", type: "=" },
      },
      distance: { val: "", type: "=" },
    },
  });

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

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const keys = name.split(".");
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
    const { name, checked } = e.target;
    setCheckboxes((prevCheckboxes) => {
      const newCheckboxes = { ...prevCheckboxes };
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
    const filtersArray: string[] = [];
    let route = filters["route"];
    for (const key in route) {
      const value = route[key as keyof typeof route];
      if (typeof value === "object" && value !== null) {
        console.log("will be checked: ", key, value);
        for (const subKey in value) {
          let subValue: any;
          if (subKey === "val" || subKey === "type") {
            subValue = value;
            if (subValue["val"] !== "" && subValue["val"] !== " ") {
              if (subValue["type"] === "=")
                filtersArray.push(`${key}._eq_${subValue["val"]}`);
              else if (subValue["type"] === "<")
                filtersArray.push(`${key}.$_lt_${subValue["val"]}`);
              else if (subValue["type"] === ">")
                filtersArray.push(`${key}.$_gt_${subValue["val"]}`);
            }
          } else {
            subValue = value[subKey as keyof typeof value];
            if (subValue["val"] !== "" && subValue["val"] !== " ") {
              console.log("filters array is", filtersArray);
              if (subValue["type"] === "=")
                filtersArray.push(`${key}.${subKey}_eq_${subValue["val"]}`);
              else if (subValue["type"] === "<")
                filtersArray.push(`${key}.${subKey}_lt_${subValue["val"]}`);
              else if (subValue["type"] === ">")
                filtersArray.push(`${key}.${subKey}_gt_${subValue["val"]}`);
            }
          }
        }
      }
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
    setCurrentPage(currentPage);
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
                            <button onClick={applyFiltersAndSort}>
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
                                    type={"number"}
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
                                    type={"text"}
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
                                    type={"bigint"}
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
                                    type={"bigint"}
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
                                    type="number"
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
                                    type={"text"}
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
                                    type={"bigint"}
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
                                    type={"bigint"}
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
                                    type={"number"}
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
                                    type={"text"}
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
                                    type={"bigint"}
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
                                    type={"bigint"}
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
                                    type={"number"}
                                />
                            </th>
                        </tr>
                        </thead>
                        {/*  */}
                        {!error && (
                            <tbody>
                            {routes.map((route, index) => (
                                <tr key={route.id}>
                                    <td>{index + 1}</td>
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
                                    <td>{route.distance.toString()}</td>
                                    <td>
                                        <button onClick={() => onEditRoute(route)}>
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
