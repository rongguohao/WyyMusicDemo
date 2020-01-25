export function limitNumberInRang(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

export function getPercent(min: number, max: number, value: number): number {
    return ((value - min) / (max - min)) * 100;
}
