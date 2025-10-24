import axios from 'axios';
import { fetchPokemonList, fetchPokemonDetails } from '../../api/pokeApi';

jest.mock('axios');

const BASE_URL = 'https://pokeapi.co/api/v2';

const MOCK_LIST = {
    count: 1328,
    results: [
        { "name": "bulbasaur", "url": `${BASE_URL}/pokemon/1/` },
        { "name": "ivysaur", "url": `${BASE_URL}/pokemon/2/` },
    ],
};

const MOCK_DETAILS = {
    id: 4,
    name: 'charmander',
    height: 6,
    weight: 85
};

describe('pokeApi', () => {
    beforeEach(() => {
        axios.get.mockClear();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        console.error.mockRestore();
    });

    describe('fetchPokemonList', () => {
        it('deve buscar a lista de pokémons com defaults (limit=20, offset=0) e retornar dados', async () => {
            axios.get.mockResolvedValueOnce({ data: MOCK_LIST });

            const result = await fetchPokemonList();

            expect(result).toEqual(MOCK_LIST);

            expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/pokemon`, {
                params: { limit: 20, offset: 0 },
            });
        });

        it('deve buscar a lista de pokémons com limit e offset específicos', async () => {
            const limit = 50;
            const offset = 100;

            axios.get.mockResolvedValueOnce({ data: MOCK_LIST });

            await fetchPokemonList(limit, offset);

            expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/pokemon`, {
                params: { limit, offset },
            });
        });

        it('deve lançar um erro em caso de falha na chamada da API', async () => {
            const error = new Error('Erro na requisição');

            axios.get.mockRejectedValueOnce(error);

            await expect(fetchPokemonList()).rejects.toThrow('Erro na requisição');

            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('fetchPokemonDetails', () => {
        const identifier = 'charmander';

        it('deve buscar detalhes de um pokémon pelo identificador e retornar dados', async () => {
            axios.get.mockResolvedValueOnce({ data: MOCK_DETAILS });

            const result = await fetchPokemonDetails(identifier);

            expect(result).toEqual(MOCK_DETAILS);
            expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/pokemon/${identifier}`);
        });

        it('deve lançar um erro se o pokémon não for encontrado ou a chamada falhar', async () => {
            const error = new Error('Pokémon not found');

            axios.get.mockRejectedValueOnce(error);

            await expect(fetchPokemonDetails(identifier)).rejects.toThrow('Pokémon not found');

            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });
});
