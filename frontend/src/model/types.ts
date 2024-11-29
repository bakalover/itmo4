export interface UserRoute {
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
    routes: UserRoute[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
}
