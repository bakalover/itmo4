export const inputConstraints: {
    [key: string]: { min?: bigint; max?: bigint, nullable: boolean, blankable?: boolean, inputComment?: string }
} = {
    'route.name': {nullable: false, blankable: false},
    'route.coordinates.x': {
        inputComment: "целое 64-битное",
        nullable: true,
        min: BigInt(-867),
        max: BigInt(2 ** 63 - 1)
    },
    'route.coordinates.y': {
        inputComment: "целое 32-битное",
        nullable: false,
        min: BigInt(-354),
        max: BigInt(2 ** 31 - 1)
    },
    'route.from.name': {
        nullable : true,
        blankable : true
    },
    'route.from.x': {
        inputComment: "вещественное double",
        nullable: false,
        min: BigInt(-(2 ** 63)),
        max: BigInt(2 ** 63 - 1)
    },
    'route.from.y': {
        inputComment: "целое 32-битное",
        nullable: false,
        min: BigInt(-(2 ** 31)),
        max: BigInt(2 ** 31 - 1)
    },
    'route.from.z': {
        inputComment: "вещественное float",
        nullable: false,
        min: BigInt(-(2 ** 63)),
        max: BigInt(2 ** 63 - 1)
    },
    'route.to.name': {
        nullable : true,
        blankable : true
    },
    'route.to.x': {
        inputComment: "вещественное double",
        nullable: false,
        min: BigInt(-(2 ** 63)),
        max: BigInt(2 ** 63 - 1)
    },
    'route.to.y': {inputComment: "целое 32-битное", nullable: false, min: BigInt(-(2 ** 31)), max: BigInt(2 ** 31 - 1)},
    'route.to.z': {
        inputComment: "вещественное float",
        nullable: false,
        min: BigInt(-(2 ** 63)),
        max: BigInt(2 ** 63 - 1)
    },
    'route.distance': {inputComment: "целое 64-битное", nullable: true, min: BigInt(2), max: BigInt(2 ** 63 - 1)},
    'simpleRoute.from' : {inputComment: "целое 32-битное", nullable: false, min: BigInt(1), max: BigInt(2 ** 31 - 1)},
    'simpleRoute.to' : {inputComment: "целое 32-битное", nullable: false, min: BigInt(1), max: BigInt(2 ** 31 - 1)},
    'simpleRoute.distance' : {inputComment: "целое 64-битное", nullable: false, min: BigInt(2), max: BigInt(2 ** 63 - 1)}
};