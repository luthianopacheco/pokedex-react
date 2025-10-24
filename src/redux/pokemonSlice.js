import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokemonList, fetchPokemonDetails } from '../api/pokeApi';
import pLimit from 'p-limit';

export const getFullPokemonList = createAsyncThunk(
    'pokemon/fetchFullList',
    async (_, { rejectWithValue }) =>  {
        try {
            const initialData = await fetchPokemonList(10000, 0);

            return initialData.results;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getPaginatedPokemonDetails = createAsyncThunk(
    'pokemon/fetchPaginatedDetails',
    async (pokemonListBasic, { rejectWithValue }) => {
        try {
            const limit = pLimit(7);

            const results = await Promise.allSettled(
                pokemonListBasic.map(pokemon => limit(async () => {
                    if (pokemon.sprites?.front_default) return pokemon;
                    return await fetchPokemonDetails(pokemon.name);
                }))
            );

            const detailedResults = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);

            if (detailedResults.length === 0) {
                return rejectWithValue('Nenhum detalhe de Pokémon pôde ser carregado.');
            }

            return detailedResults;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getPokemonDetails = createAsyncThunk(
    'pokemon/fetchDetails',
    async (identifier, { rejectWithValue }) => {
        try {
            const details = await fetchPokemonDetails(identifier);

            return details;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const extractId = (url) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]); 
}

const initialState = {
    fullList: [],
    loadingFullList: false,
    fullListError: null,

    paginatedList: [],
    loadingPaginated: false,
    paginatedError: null,

    currentPokemon: null,
    loadingDetail: false,
    detailError: null,

    count: 0,
    next: null,
    previous: null,
};

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: initialState,
    reducers: {
        resetCurrentPokemon: (state) => {
            state.currentPokemon = null;
            state.detailError = null;
        },

        resetSearch: (state) => {
            state.paginatedList = [];
            state.count = 0;
            state.next = null;
            state.previous = null;
            state.paginatedError = null;
        },

        clearPaginatedList: (state) => {
            state.paginatedList = [];
            state.paginatedError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFullPokemonList.pending, (state) => {
                state.loadingFullList = true;
                state.fullListError = null;
            })
            .addCase(getFullPokemonList.fulfilled, (state, action) => {
                state.fullList = action.payload.map((p) => ({
                    ...p, id: extractId(p.url)
                }));

                state.loadingFullList = false;
            })
            .addCase(getFullPokemonList.rejected, (state, action) => {
                state.fullListError = action.payload || 'Falha ao carregar a lista completa de cache.';
                state.loadingFullList = false;
            })

            .addCase(getPaginatedPokemonDetails.pending, (state) => {
                state.loadingPaginated = true;
                state.paginatedError = null;
            })
            .addCase(getPaginatedPokemonDetails.fulfilled, (state, action) => {
                const updatedPokemons = action.payload;

                updatedPokemons.forEach(detailedPokemon => {
                    const index = state.fullList.findIndex(p => p.name === detailedPokemon.name);
                    if (index !== -1) {
                        state.fullList[index] = detailedPokemon;
                    }
                });

                state.paginatedList = updatedPokemons;
                state.loadingPaginated = false;
            })
            .addCase(getPaginatedPokemonDetails.rejected, (state, action) => {
                state.paginatedError = action.payload || 'Falha ao carregar detalhes da página.';
                state.paginatedList = [];
                state.loadingPaginated = false;
            })

            .addCase(getPokemonDetails.pending, (state) => {
                state.loadingDetail = true;
                state.detailError = null;
            })
            .addCase(getPokemonDetails.fulfilled, (state, action) => {
                state.currentPokemon = action.payload;
                state.detailError = null;
                state.loadingDetail = false;
            })
            .addCase(getPokemonDetails.rejected, (state, action) => {
                state.detailError = action.payload || 'Pokémon não encontrado ou erro de API.';
                state.currentPokemon = null;
                state.loadingDetail = false;
            });
    },
});

export const { resetCurrentPokemon, resetSearch, clearPaginatedList } = pokemonSlice.actions;
export default pokemonSlice.reducer;