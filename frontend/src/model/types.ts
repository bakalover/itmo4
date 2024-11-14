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
    name: string;
  };
  to: {
    id: number | null;
    x: bigint | null;
    y: number;
    z: number;
    name: string;
  } | null;
  distance: bigint;
}

export interface RouteBoolean {
    id: boolean,
    name: boolean,
    coordinates: {
        x: boolean,
        y: boolean,
    },
    creationDate: boolean,
    from: {
        id: boolean,
        name: boolean,
        x: boolean,
        y: boolean,
        z: boolean,
    },
    to: {
        id: boolean,
        name: boolean,
        x: boolean,
        y: boolean,
        z: boolean,
    },
    distance: boolean,
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
