import React, {useEffect, useState} from 'react';
import {fetchMinRoute} from '../api';
import {UserRoute} from "../model/types";
import { useNavigate } from 'react-router-dom';


const GetMinRoute: React.FC = () => {
    const [route, setRoute] = useState<UserRoute | null>(null);
    const navigate = useNavigate()
    const handleBack = () => {
      navigate("/");
    };
    useEffect(() => {
        const loadMinRoute = async () => {
            try {
                const data: UserRoute = await fetchMinRoute();
                setRoute(data);
            } catch (error) {
                console.error('Error fetching min route:', error);
            }
        };

        loadMinRoute();
    }, []);

    if (!route) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Информация о минимальном маршруте</h2>
            <table>
                <tbody>
                <tr>
                    <th>ID</th>
                    <td>{route.id}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{route.name}</td>
                </tr>
                <tr>
                    <th>Coordinates</th>
                    <td>
                        x: {route.coordinates.x?.toString()}, y: {route.coordinates.y}
                    </td>
                </tr>
                <tr>
                    <th>Creation Date</th>
                    <td>{route.creationDate}</td>
                </tr>
                <tr>
                    <th>From</th>
                    <td>
                        x: {route.from.x?.toString()}, y: {route.from.y}, z: {route.from.z}, name: {route.from.name}
                    </td>
                </tr>
                {route.to !== null && (
                    <tr>
                        <th>To</th>
                        <td>
                            x: {route.to.x?.toString()}, y: {route.to.y}, z: {route.to.z}, name: {route.to.name}
                        </td>
                    </tr>
                )}

                <tr>
                    <th>Distance</th>
                    <td>{route.distance?.toString()}</td>
                </tr>
                </tbody>
            </table>
            <button onClick={handleBack} className="addRoute">
              Назад
            </button>
        </div>
    );
};

export default GetMinRoute;
