import {
    getFullPokemonList,
    getPaginatedPokemonDetails,
    getPokemonDetails,
    resetCurrentPokemon,
    resetSearch,
    clearPaginatedList,
    default as pokemonReducer,
} from '../../redux/pokemonSlice';

jest.mock('../../api/pokeApi');

const INITIAL_STATE = {
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

const MOCK_LIST_BASIC = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
];

const MOCK_FULL_LIST = MOCK_LIST_BASIC.map(p => ({ ...p, id: parseInt(p.url.split('/')[6]) }));

const MOCK_DETAILS_BULBASAUR = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: { front_default: 'url-bulbasaur' }
};

const MOCK_DETAILS_CHARMANDER = {
    id: 4,
    name: 'charmander',
    height: 6,
    weight: 85,
    sprites: { front_default: 'url-charmander' }
};

const MOCK_PAGINATED_PAYLOAD = [MOCK_DETAILS_BULBASAUR, MOCK_DETAILS_CHARMANDER];

describe('Pokemon Slice - Reducers', () => {

    it('deve retornar o estado inicial', () => {
        expect(pokemonReducer(undefined, {})).toEqual(INITIAL_STATE);
    });

    it('deve lidar com resetCurrentPokemon', () => {
        const stateWithDetail = {
            ...INITIAL_STATE,
            currentPokemon: MOCK_DETAILS_BULBASAUR,
            detailError: 'Erro'
        };
        const newState = pokemonReducer(stateWithDetail, resetCurrentPokemon());
        expect(newState.currentPokemon).toBeNull();
        expect(newState.detailError).toBeNull();
    });

    it('deve lidar com resetSearch', () => {
        const stateBefore = {
            ...INITIAL_STATE,
            paginatedList: MOCK_LIST_BASIC,
            count: 100,
            paginatedError: 'Erro',
            next: 'next-url'
        };
        const newState = pokemonReducer(stateBefore, resetSearch());
        expect(newState.paginatedList).toEqual([]);
        expect(newState.count).toBe(0);
        expect(newState.paginatedError).toBeNull();
        expect(newState.next).toBeNull();
    });

    it('deve lidar com clearPaginatedList', () => {
        const stateBefore = {
            ...INITIAL_STATE,
            paginatedList: MOCK_LIST_BASIC,
            paginatedError: 'Erro'
        };
        const newState = pokemonReducer(stateBefore, clearPaginatedList());
        expect(newState.paginatedList).toEqual([]);
        expect(newState.paginatedError).toBeNull();
    });

});

describe('Pokemon Slice - Extra Reducers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFullPokemonList', () => {
        const MOCK_API_RESPONSE = { results: MOCK_LIST_BASIC, count: 10000 };

        it('pending: deve definir loadingFullList como true', () => {
            const newState = pokemonReducer(INITIAL_STATE, getFullPokemonList.pending());
            expect(newState.loadingFullList).toBe(true);
            expect(newState.fullListError).toBeNull();
        });

        it('fulfilled: deve carregar a fullList e extrair o ID', () => {
            const newState = pokemonReducer(INITIAL_STATE, getFullPokemonList.fulfilled(MOCK_API_RESPONSE.results, 'requestId'));
            expect(newState.loadingFullList).toBe(false);
            expect(newState.fullList).toEqual(MOCK_FULL_LIST);
        });

        it('rejected: deve definir fullListError e loadingFullList como false', () => {
            const errorPayload = 'Erro de API';
            const newState = pokemonReducer(INITIAL_STATE, getFullPokemonList.rejected(null, 'requestId', null, errorPayload));
            expect(newState.loadingFullList).toBe(false);
            expect(newState.fullListError).toBe(errorPayload);
        });
    });

    describe('getPokemonDetails', () => {

        it('pending: deve definir loadingDetail como true', () => {
            const newState = pokemonReducer(INITIAL_STATE, getPokemonDetails.pending());
            expect(newState.loadingDetail).toBe(true);
            expect(newState.detailError).toBeNull();
        });

        it('fulfilled: deve carregar o currentPokemon', () => {
            const newState = pokemonReducer(INITIAL_STATE, getPokemonDetails.fulfilled(MOCK_DETAILS_BULBASAUR, 'requestId', 'bulbasaur'));
            expect(newState.loadingDetail).toBe(false);
            expect(newState.currentPokemon).toEqual(MOCK_DETAILS_BULBASAUR);
        });

        it('rejected: deve definir detailError e limpar currentPokemon', () => {
            const errorPayload = 'Não encontrado.';
            const newState = pokemonReducer(INITIAL_STATE, getPokemonDetails.rejected(null, 'requestId', 'invalid', errorPayload));
            expect(newState.loadingDetail).toBe(false);
            expect(newState.detailError).toBe(errorPayload);
            expect(newState.currentPokemon).toBeNull();
        });
    });

    describe('getPaginatedPokemonDetails', () => {

        const stateWithFullList = { ...INITIAL_STATE, fullList: MOCK_FULL_LIST };

        it('pending: deve definir loadingPaginated como true', () => {
            const newState = pokemonReducer(INITIAL_STATE, getPaginatedPokemonDetails.pending());
            expect(newState.loadingPaginated).toBe(true);
            expect(newState.paginatedError).toBeNull();
        });


        describe('Reducer Handling (fulfilled)', () => {
            it('deve atualizar paginatedList e atualizar fullList com detalhes', () => {
                const action = getPaginatedPokemonDetails.fulfilled(MOCK_PAGINATED_PAYLOAD, 'requestId', MOCK_LIST_BASIC);
                const newState = pokemonReducer(stateWithFullList, action);

                expect(newState.loadingPaginated).toBe(false);
                expect(newState.paginatedList).toEqual(MOCK_PAGINATED_PAYLOAD);

                expect(newState.fullList.find(p => p.name === 'bulbasaur')).toEqual(MOCK_DETAILS_BULBASAUR);
            });
        });

        describe('Reducer Handling (rejected)', () => {
            it('deve definir paginatedError e limpar paginatedList', () => {
                const errorPayload = 'Erro de carregamento paginado.';
                const action = getPaginatedPokemonDetails.rejected(null, 'requestId', null, errorPayload);
                const newState = pokemonReducer(stateWithFullList, action);

                expect(newState.loadingPaginated).toBe(false);
                expect(newState.paginatedError).toBe(errorPayload);
                expect(newState.paginatedList).toEqual([]);
            });
        });

    });
});