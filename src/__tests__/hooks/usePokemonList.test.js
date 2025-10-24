import { renderHook, act } from '@testing-library/react';
import { usePokemonList } from '../../hooks/usePokemonList';
import * as slice from '../../redux/pokemonSlice';

jest.mock('../../redux/pokemonSlice', () => ({
    ...jest.requireActual('../../redux/pokemonSlice'),
    getPaginatedPokemonDetails: jest.fn((list) => ({ type: 'pokemon/getPaginatedDetails', payload: list })),
    getFullPokemonList: jest.fn(() => ({ type: 'pokemon/getFullList' })),
    resetSearch: jest.fn(() => ({ type: 'pokemon/resetSearch' })),
    resetCurrentPokemon: jest.fn(() => ({ type: 'pokemon/resetCurrentPokemon' })),
    clearPaginatedList: jest.fn(() => ({ type: 'pokemon/clearPaginatedList' })),
}));

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (callback) => mockSelector(callback),
}));

const MOCK_FULL_LIST = Array.from({ length: 42 }, (_, i) => ({
    id: i + 1,
    name: `pokemon${i + 1}`,
}));

const MOCK_STATE = {
    paginatedList: MOCK_FULL_LIST.slice(0, 20).map(p => p),
    loadingPaginated: false,
    paginatedError: null,
    fullList: MOCK_FULL_LIST,
    loadingFullList: false,
    fullListError: null,
};

const RESET_SEARCH_PAYLOAD = { type: 'pokemon/resetSearch' };

describe('usePokemonList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSelector.mockImplementation((callback) => callback({ pokemon: MOCK_STATE }));
        global.alert = jest.fn();
    });

    describe('Lifecycle/Initial Load', () => {
        it('deve despachar getFullPokemonList se a lista completa estiver vazia', () => {
            const initialState = { ...MOCK_STATE, fullList: [], loadingFullList: false };
            mockSelector.mockImplementation((callback) => callback({ pokemon: initialState }));

            renderHook(() => usePokemonList());

            expect(mockDispatch).toHaveBeenCalledWith(slice.getFullPokemonList());
        });

        it('deve despachar fetchPaginatedDetails (página 1) se fullList estiver pronto e paginatedList estiver vazia', () => {
            const initialState = { ...MOCK_STATE, paginatedList: [] };
            mockSelector.mockImplementation((callback) => callback({ pokemon: initialState }));

            const expectedSlice = MOCK_FULL_LIST.slice(0, 20);

            renderHook(() => usePokemonList());

            expect(mockDispatch).toHaveBeenCalledWith(
                slice.getPaginatedPokemonDetails(expectedSlice)
            );
        });

        it('deve chamar resetCurrentPokemon em qualquer carregamento', () => {
            renderHook(() => usePokemonList());
            expect(mockDispatch).toHaveBeenCalledWith(slice.resetCurrentPokemon());
        });
    });

    describe('Pagination Logic', () => {
        it('deve buscar novos detalhes paginados quando handlePageChange é chamado (não buscando)', () => {
            const { result } = renderHook(() => usePokemonList());

            act(() => {
                result.current.handlePageChange(2);
            });

            const expectedSlice = MOCK_FULL_LIST.slice(20, 40);

            expect(mockDispatch).toHaveBeenCalledWith(
                slice.getPaginatedPokemonDetails(expectedSlice)
            );

            expect(result.current.currentPage).toBe(2);
        });

        it('deve aplicar paginação ao cache local quando em modo de busca', () => {
            const { result } = renderHook(() => usePokemonList());

            act(() => {
                result.current.handleSearch('pokemon1');
            });


            act(() => {
                result.current.handlePageChange(2);
            });

            expect(result.current.pokemons).toEqual([]);
            expect(result.current.currentPage).toBe(2);
        });
    });

    describe('Search Logic (handleSearch)', () => {
        it('deve filtrar a fullList e atualizar o cache e o display', () => {
            const { result } = renderHook(() => usePokemonList());

            act(() => {
                result.current.handleSearch('1');
            });

            expect(result.current.isSearching).toBe(true);

            const expectedFiltered = MOCK_FULL_LIST.filter(p => p.name.includes('1'));

            expect(result.current.pokemons).toEqual(expectedFiltered.slice(0, 20));

            expect(result.current.totalPages).toBe(1); expect(result.current.currentPage).toBe(1);
            expect(mockDispatch).toHaveBeenCalledWith(slice.resetSearch());
        });

        it('deve disparar alerta e não buscar se fullList não estiver pronto', () => {
            const initialState = { ...MOCK_STATE, fullList: [], loadingFullList: true };
            mockSelector.mockImplementation((callback) => callback({ pokemon: initialState }));

            const { result } = renderHook(() => usePokemonList());

            act(() => {
                result.current.handleSearch('Charmander');
            });

            expect(global.alert).toHaveBeenCalled();
            expect(result.current.isSearching).toBe(false);
            expect(mockDispatch).not.toHaveBeenCalledWith(RESET_SEARCH_PAYLOAD);
        });
    });

    describe('Reset Logic (handleReset)', () => {
        it('deve resetar o modo de busca e buscar a primeira página', () => {
            const { result } = renderHook(() => usePokemonList());

            act(() => {
                result.current.handleSearch('1');
            });

            act(() => {
                result.current.handleReset();
            });

            expect(result.current.isSearching).toBe(false);

            expect(mockDispatch).toHaveBeenCalledWith(slice.resetSearch());

            const expectedSlice = MOCK_FULL_LIST.slice(0, 20);
            expect(mockDispatch).toHaveBeenCalledWith(
                slice.getPaginatedPokemonDetails(expectedSlice)
            );
        });
    });
});