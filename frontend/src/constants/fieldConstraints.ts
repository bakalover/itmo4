export const inputConstraints: { [key: string]: { min: bigint; max: bigint } } = {
    'route.coordinates.x': { min: BigInt(-867), max:  BigInt(2 ** 63) },
    'route.coordinates.y': { min: BigInt(-354), max: BigInt(2 ** 63) },
    'route.from.x': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.from.y': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.from.z': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.to.x': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.to.y': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.to.z': { min: BigInt(-(2 ** 63)), max: BigInt(2 ** 63) },
    'route.distance': { min: BigInt(2), max: BigInt(2 ** 63) },
};