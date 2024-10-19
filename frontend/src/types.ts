export interface Route {
    id: number;
    name: string;
    coordinates: {
        x: number;
        y: number;
    };
    creationDate: string;
    from: {
        id: number
        x: number;
        y: number;
        z: number;
        name: string;
    };
    to: {
        id: number
        x: number;
        y: number;
        z: number;
        name: string;
    };
    distance: number;
}

export interface ApiResponse {
    routes: Route[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}