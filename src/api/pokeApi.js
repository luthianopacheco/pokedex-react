import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 20, offset = 0) => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon`, {
            params: { limit, offset }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchPokemonDetails = async (identifier) => {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon/${identifier}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};