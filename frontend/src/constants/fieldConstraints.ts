import bigDecimal from "js-big-decimal";

const MAX_INT = 2 ** 31;
const MAX_LONG = 2 ** 63;
const MIN_FLOAT = new bigDecimal(-3.4 * (10 ** 38))
const MAX_FLOAT = new bigDecimal(3.4 * (10 ** 38))

export interface FieldConstraints {
    dataType: string; //type can be: int, long, float, string
    min?: any;
    max?: any;
    nullable: boolean;
    blank_able?: boolean;
    inputComment?: string;
}

export const inputConstraints: {
    [key: string]: FieldConstraints;
} = {
    "route.id": {
        dataType: "int",
        nullable: false,
        min: BigInt(1),
        max: BigInt(MAX_INT - 1)
    },
    "route.name": {
        dataType: "text",
        nullable: false,
        blank_able: false
    },
    "route.coordinates.x": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(-867),
        max: BigInt(MAX_LONG - 1),
    },
    "route.coordinates.y": {
        dataType: "int",
        inputComment: "целое знаковое 32-битное",
        nullable: false,
        min: BigInt(-354),
        max: BigInt(MAX_INT - 1),
    },
    "route.from.id": {
        dataType: "long",
        min: BigInt(1),
        max: BigInt(MAX_LONG - 1),
        nullable: true,
    },
    "route.from.name": {
        dataType: "text",
        nullable: true,
        blank_able: true,
    },
    "route.from.x": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(-MAX_LONG),
        max: BigInt(MAX_LONG - 1),
    },
    "route.from.y": {
        dataType: "int",
        inputComment: "целое знаковое 32-битное",
        nullable: false,
        min: BigInt(-MAX_INT),
        max: BigInt(MAX_INT - 1),
    },
    "route.from.z": {
        dataType: "float",
        inputComment: "с точностью не более 8 знаков вещественное float",
        nullable: false,
        min: MIN_FLOAT,
        max: MAX_FLOAT,
    },
    "route.to.id": {
        dataType: "long",
        min: BigInt(1),
        max: BigInt(MAX_LONG - 1),
        nullable: true,
    },
    "route.to.name": {
        dataType: "text",
        nullable: true,
        blank_able: true,
    },
    "route.to.x": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(-MAX_LONG),
        max: BigInt(MAX_LONG - 1),
    },
    "route.to.y": {
        dataType: "int",
        inputComment: "целое знаковое 32-битное",
        nullable: false,
        min: BigInt(-MAX_INT),
        max: BigInt(MAX_INT - 1),
    },
    "route.to.z": {
        dataType: "float",
        inputComment: "с точностью не более 8 знаков вещественное float",
        nullable: false,
        min: MIN_FLOAT,
        max: MAX_FLOAT,
    },
    "route.distance": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(2),
        max: BigInt(MAX_LONG - 1),
    },
    "simpleRoute.from": { //this is location id
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        min: BigInt(1),
        max: BigInt(MAX_LONG - 1),
        nullable: false, //TODO for input --- nullable is false
    },
    "simpleRoute.to": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        min: BigInt(1),
        max: BigInt(MAX_LONG - 1),
        nullable: false,
    },
    "simpleRoute.distance": {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(2),
        max: BigInt(MAX_LONG - 1),
    },
    from: {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        min: BigInt(1),
        max: BigInt(MAX_INT - 1),
        nullable: false,
    },
    to: {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        min: BigInt(1),
        max: BigInt(MAX_LONG - 1),
        nullable: false,
    },
    distance: {
        dataType: "long",
        inputComment: "целое знаковое 64-битное",
        nullable: false, //primitive can not be null
        min: BigInt(2),
        max: BigInt(MAX_LONG - 1),
    }
};
