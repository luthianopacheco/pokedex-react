import { capitalize } from '@mui/material';

export const formatStat = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return (value / 10).toFixed(1);
}

export const formatName = (name) => {
    if (!name) return '';
    return capitalize(name.replace(/-/g, ' '));
}