export const inputConstraints: { [key: string]: { min: number; max: number } } = {
    'route.coordinates.x': { min: -867, max:  9223372036854775807 },
    'route.coordinates.y': { min: -334, max: 9223372036854775807 },
    'route.from.x': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.from.y': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.from.z': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.to.x': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.to.y': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.to.z': { min: -9223372036854775808, max: 9223372036854775807 },
    'route.distance': { min: 2, max: 9223372036854775807 },
};