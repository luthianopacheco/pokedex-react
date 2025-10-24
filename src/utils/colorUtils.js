import { POKEMON_TYPE_COLORS } from "../constants/pokemonTypes";

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function getContrastColor(type) {
    const normalizedType = type ? String(type).toLowerCase() : '';
    const colorEntry = POKEMON_TYPE_COLORS[normalizedType] || POKEMON_TYPE_COLORS['default'];
    const hex = colorEntry.color;
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';

    const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

    const threshold = 0.7;
    return luminance < threshold ? '#FAFAFA' : '#000000';
}

export function getTypeColorWithOpacity({ type, opacity = 1 }) {
    const normalizedType = type ? String(type).toLowerCase() : '';
    const colorEntry = POKEMON_TYPE_COLORS[normalizedType];

    const hex = colorEntry.color ?? POKEMON_TYPE_COLORS['default'].color;
    const rgb = hexToRgb(hex);
    const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b},${opacity})`;

    return color
}