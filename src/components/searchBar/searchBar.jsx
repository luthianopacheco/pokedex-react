import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Box
} from '@mui/material';

export default function SearchBar({ onSearch, onReset }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        onReset();
    }

    return (
        <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
                display: 'flex',
                gap: 2,
                margin: '20px auto',
                maxWidth: '80vw',
                padding: '0 20px'
            }}
        >
            <TextField
                fullWidth
                label="Buscar Pokémon"
                placeholder="busque pelo nome ou id do Pokémon"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm.trim() && (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="limpar busca"
                                    onClick={handleReset}
                                    edge="end"
                                    size="small"
                                    title='Limpar busca'
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },

                }}
                sx={{ '& fieldset': { borderRadius: '50px' } }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={!searchTerm.trim()}
                sx={{
                    borderRadius: '50px', minWidth: '56px', backgroundColor: '#CC0000',
                    '&:hover': { backgroundColor: '#FFCB05' }
                }}
            >
                <SearchIcon />
            </Button>
        </Box>
    );
}