import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    getRoutesWithDistanceCount,
    getRoutesWithDistanceGreater,
} from "../api";
import {UserRoute} from "../model/types";
import {getErrorMessage} from "../utils/getErrorMessage";
import RoutesWithDistanceForm from "../components/forms/RoutesWithDistanceForm";

interface State {
    routes: UserRoute[];
    distance: bigint;
    isError: boolean;
    count: number;
    errorMessage: string;
}

const initialState: State = {
    routes: [],
    distance: BigInt(100),
    isError: false,
    count: 0,
    errorMessage: "",
};

const GetRoutesWithDistance: React.FC = () => {
    const [routesState, setState] = useState<State>(initialState);
    const [correctDistance, setCorrectDistance] = useState(true);

    const handleDistanceCorrectnessChange = (value: boolean) => {
        setCorrectDistance(value)
    }
    const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

    const handleCreater = async () => {
        try {
            const newRoutes: UserRoute[] = await getRoutesWithDistanceGreater(
                routesState?.distance,
            );
            setState((prevState) => ({
                ...prevState,
                routes: newRoutes,
                isError: false,
                count: 0,
                errorMessage: "",
            }));
        } catch (error) {
            console.log(error);
            setState((prevState) => ({
                ...prevState,
                routes: [],
                count: 0,
                isError: true,
                errorMessage:
                    "Ошибка при получении маршрутов: " + getErrorMessage(error),
            }));
        }
    };

    const handleCount = async () => {
        try {
            const newCount: any = await getRoutesWithDistanceCount(
                routesState?.distance,
            );
            console.log("New count:", newCount);
            setState((prevState) => ({
                ...prevState,
                routes: [],
                isError: false,
                count: newCount,
                errorMessage: "",
            }));
        } catch (error) {
            console.log(error);
            setState((prevState) => ({
                ...prevState,
                routes: [],
                count: 0,
                isError: true,
                errorMessage:
                    "Ошибка при получении маршрутов: " + getErrorMessage(error),
            }));
        }
    };

    return (
        <div>
            <h3>Маршруты c дистанцией больше заданной</h3>
            {routesState.isError && (
                <p>
                    <b>{routesState.errorMessage}</b>
                </p>
            )}
            <br/>
            <RoutesWithDistanceForm state={routesState} setState={setState}
                                    onFormCorrectnessChange={handleDistanceCorrectnessChange}/>
            <button onClick={handleCreater} disabled={!correctDistance}>
                Получить с дистанцией больше заданной
            </button>
            <button onClick={handleCount} disabled={!correctDistance}>Получить число заданной дистанцией</button>
            {
                routesState.count !== 0 && (
                    <p>
                        <b>Число маршрутов: {routesState.count}</b>
                    </p>
                )
            }

            <div
                style={{textAlign: "center", marginTop: "50px", marginLeft: "300px"}}
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
                            <td>{route.distance?.toString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        <button onClick={handleBack}>Назад</button>
    </div>
    )
        ;
};

export default GetRoutesWithDistance;
