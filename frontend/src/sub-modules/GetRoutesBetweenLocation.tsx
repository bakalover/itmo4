import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRouteBeetweenLocations } from "../api";
import { RenderInput } from "../components/RenderInput";
import { UserRoute } from "../model/types";
import { getErrorMessage } from "../utils/getErrorMessage";

interface State {
  routes: UserRoute[];
  from: number;
  to: number;
  isError: boolean;
  errorMessage: string;
}

const initialState: State = {
  routes: [],
  from: 1,
  to: 2,
  isError: false,
  errorMessage: "",
};

const GetRoutesBetweenLocation: React.FC = () => {
  const [routesState, setState] = useState<State>(initialState);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  const handleGetRoutesBeetwenLocations = async () => {
    try {
      const newRoutes: UserRoute[] = await getRouteBeetweenLocations(
        routesState?.from,
        routesState?.to,
      );
      setState((prevState) => ({
        ...prevState,
        routes: newRoutes,
        isError: false,
        errorMessage: "",
      }));
    } catch (error) {
      console.log(error);
      setState((prevState) => ({
        ...prevState,
        routes: [],
        isError: true,
        errorMessage:
          "Ошибка при получении маршрутов: " + getErrorMessage(error),
      }));
    }
  };

  return (
    <div>
      <h3>Маршруты между выбранными локациями</h3>
      {routesState.isError && (
        <p>
          <b>{routesState.errorMessage}</b>
        </p>
      )}
      <br />
      <RenderInput
        label="Стартовая локация"
        path="from"
        state={routesState}
        setState={setState}
        type="number"
        inline={false}
        filter={false}
      />
      <br />
      {/* <label htmlFor="route-destination">Id конечной точки маршрута:</label> */}
      <br />
      {/* <input id="route-destination" type="text" placeholder="До" /> */}
      <RenderInput
        label="Конечная локация"
        path="to"
        state={routesState}
        setState={setState}
        type="number"
        inline={false}
        filter={false}
      />
      <br />
      <button onClick={handleGetRoutesBeetwenLocations}>Получить</button>
      <div
        style={{ textAlign: "center", marginTop: "50px", marginLeft: "250px" }}
      >
        <table>
          <tbody>
            {routesState.routes.length !== 0 && (
              <tr>
                <td>Id</td>
                <td>Name</td>
                <td>Coordinates</td>
                <td>Creation Date</td>
                <td>Location From</td>
                <td>Location To</td>
                <td>Distance</td>
              </tr>
            )}
            {routesState.routes.map((route) => (
              <tr>
                <td>{route.id}</td>

                <td>{route.name}</td>
                <td>
                  x: {route.coordinates.x?.toString()}, y: {route.coordinates.y}
                </td>
                <td>{route.creationDate}</td>
                <td>
                  x: {route.from.x?.toString()}, y: {route.from.y}, z:{" "}
                  {route.from.z}, name: {route.from.name}
                </td>
                {route.to !== null && (
                  <td>
                    x: {route.to.x?.toString()}, y: {route.to.y}, z:{" "}
                    {route.to.z}, name: {route.to.name}
                  </td>
                )}
                <td>{route.distance.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleBack}>Назад</button>
    </div>
  );
};

export default GetRoutesBetweenLocation;
