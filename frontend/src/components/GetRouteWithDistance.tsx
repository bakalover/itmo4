import React from 'react';

const GetRouteWithDistance: React.FC = () => {
    return <div>
        <h3>Фильтрация маршрутов по расстоянию</h3>
        <p>Все маршруты, расстояние в которых</p>
        <select>
            <option>Равно</option>
            <option>Меньше</option>
        </select>
        <input type="number" min="1"/>
        <button>Получить</button>
    </div>;
};

export default GetRouteWithDistance;
