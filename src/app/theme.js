import { createTheme } from '@mui/material/styles';

const POKEDEX_THEME = createTheme({
    typography: {
        fontFamily: ['Poppins', 'sans-serif',].join(','),
    },

    palette: {
        primary: {
            main: '#FF0000',
            light: '#FF3333',
            dark: '#AA0000',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#222222',
            light: '#cccccc',
            medium: '#555555',
            dark: '#000000',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FAFAFA',
        },
    },
});

export default POKEDEX_THEME;