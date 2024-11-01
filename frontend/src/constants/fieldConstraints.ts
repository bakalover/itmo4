const MAX_INT = 2 ** 31;
const MAX_LONG = 2 ** 63;

export const inputConstraints: {
    [key: string]: { min?: bigint; max?: bigint, nullable: boolean, blankable?: boolean, inputComment?: string }
} = {
    'route.id' : {nullable : false, min : BigInt(1), max : BigInt(MAX_INT - 1)},
    'route.name': {nullable: false, blankable: false},
    'route.coordinates.x': {
        inputComment: "целое 64-битное",
        nullable: true,
        min: BigInt(-867),
        max: BigInt(MAX_LONG - 1)
    },
    'route.coordinates.y': {
        inputComment: "целое 32-битное",
        nullable: false,
        min: BigInt(-354),
        max: BigInt(MAX_INT - 1)
    },
    'route.from.id' : {
        min: BigInt(1),
        max: BigInt(MAX_INT - 1),
        nullable: true
    },
    'route.from.name': {
        nullable : true,
        blankable : true
    },
    'route.from.x': {
        inputComment: "вещественное double",
        nullable: false,
        min: BigInt(-(MAX_LONG)),
        max: BigInt(MAX_LONG - 1)
    },
    'route.from.y': {
        inputComment: "целое 32-битное",
        nullable: false,
        min: BigInt(-(MAX_INT)),
        max: BigInt(MAX_INT - 1)
    },
    'route.from.z': {
        inputComment: "вещественное float",
        nullable: false,
        min: BigInt(-(MAX_LONG)),
        max: BigInt(MAX_LONG - 1)
    },
    'route.to.id' : {
        min: BigInt(1),
        max: BigInt(MAX_INT - 1),
        nullable: true
    },
    'route.to.name': {
        nullable : true,
        blankable : true
    },
    'route.to.x': {
        inputComment: "вещественное double",
        nullable: false,
        min: BigInt(-(MAX_LONG)),
        max: BigInt(MAX_LONG - 1)
    },
    'route.to.y': {inputComment: "целое 32-битное", nullable: false, min: BigInt(-(MAX_INT)), max: BigInt(MAX_INT - 1)},
    'route.to.z': {
        inputComment: "вещественное float",
        nullable: false,
        min: BigInt(-(MAX_LONG)),
        max: BigInt(MAX_LONG - 1)
    },
    'route.distance': {inputComment: "целое 64-битное", nullable: true, min: BigInt(2), max: BigInt(MAX_LONG - 1)},
    'simpleRoute.from' : {inputComment: "целое 32-битное", nullable: false, min: BigInt(1), max: BigInt(MAX_INT - 1)},
    'simpleRoute.to' : {inputComment: "целое 32-битное", nullable: false, min: BigInt(1), max: BigInt(MAX_INT - 1)},
    'simpleRoute.distance' : {inputComment: "целое 64-битное", nullable: false, min: BigInt(2), max: BigInt(MAX_LONG - 1)}
};