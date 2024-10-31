export interface Route {
    id: number;
    name: string;
    coordinates: {
        x: bigint | null;
        y: number;
    };
    creationDate: string;
    from: {
        id: number | null;
        x: bigint | null;
        y: number;
        z: number;
        name: string;
    };
    to: {
        id: number | null;
        x: bigint | null;
        y: number;
        z: number;
        name: string;
    };
    distance: bigint;
}

export interface SimpleRoute {
    from: number;
    to: number;
    distance: number;
}

export interface ApiResponse {
    routes: Route[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}

