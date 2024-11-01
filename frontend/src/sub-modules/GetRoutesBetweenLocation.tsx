import React from 'react';

const GetRoutesBetweenLocation: React.FC = () => {
    return <div>
        <h3>Маршруты между выбранными локациями</h3>
        <label htmlFor="route-source">Id начальной точки маршрута</label>
        <br/>
        <input
            id="route-source"
            type="text"
            placeholder="От"
        />
        <br/>
        <label htmlFor="route-destination">Id конечной точки маршрута:</label>
        <br/>
        <input
            id="route-destination"
            type="text"
            placeholder="До"
        />
        <br/>
        <button>Получить</button>
    </div>;
};

export default GetRoutesBetweenLocation;
