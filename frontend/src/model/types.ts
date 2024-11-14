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
        name: string | null;
    };
    to: {
        id: number | null;
        x: bigint | null;
        y: number;
        z: number;
        name: string | null;
    } | null;
    distance: bigint | null;
}


export interface SimpleRoute {
    from: number;
    to: number;
    distance: bigint;
}

export interface ApiResponse {
    routes: Route[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}

