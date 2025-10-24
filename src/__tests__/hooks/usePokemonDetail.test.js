import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { getPokemonDetails, resetCurrentPokemon } from '../../redux/pokemonSlice';

jest.mock('../../redux/pokemonSlice', () => ({
    getPokemonDetails: jest.fn((id) => ({ type: 'pokemon/fetchDetails', payload: id })),
    resetCurrentPokemon: jest.fn(() => ({ type: 'pokemon/resetCurrentPokemon' })),
}));

const mockUseParams = jest.fn();
jest.mock('react-router', () => ({
    useParams: () => mockUseParams(),
}));

const mockDispatch = jest.fn();
const mockSelector = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (callback) => mockSelector(callback),
}));

const MOCK_STATE_SUCCESS = {
    currentPokemon: { id: 1, name: 'bulbasaur' },
    loadingDetail: false,
    errorDetail: null,
};
const MOCK_STATE_LOADING = {
    currentPokemon: null,
    loadingDetail: true,
    errorDetail: null,
};

describe('usePokemonDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSelector.mockImplementation((callback) => callback({ pokemon: MOCK_STATE_SUCCESS }));
        mockUseParams.mockReturnValue({ nameOrId: 'bulbasaur' });
    });

    it('deve chamar getPokemonDetails ao ser montado com um nome válido', () => {
        mockUseParams.mockReturnValue({ nameOrId: 'charmander' });

        renderHook(() => usePokemonDetail());

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(getPokemonDetails('charmander'));
    });

    it('deve chamar resetCurrentPokemon na desmontagem', () => {
        const { unmount } = renderHook(() => usePokemonDetail());

        unmount();

        expect(mockDispatch).toHaveBeenCalledWith(resetCurrentPokemon());
    });

    it('NÃO deve chamar getPokemonDetails se nameOrId for nulo ou indefinido', () => {
        mockUseParams.mockReturnValue({ nameOrId: undefined });

        renderHook(() => usePokemonDetail());

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('deve formatar o nameOrId (trim e lowercase) antes de despachar', () => {
        mockUseParams.mockReturnValue({ nameOrId: ' BULBASAUR ' });

        renderHook(() => usePokemonDetail());

        expect(mockDispatch).toHaveBeenCalledWith(getPokemonDetails('bulbasaur'));
    });

    it('deve retornar pokemon, loading e error do estado do Redux', () => {
        mockSelector.mockImplementation((callback) => callback({ pokemon: MOCK_STATE_LOADING }));
        const { result } = renderHook(() => usePokemonDetail());

        expect(result.current.pokemon).toBeNull();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('deve retornar os dados do pokemon quando estiver carregado', () => {
        mockSelector.mockImplementation((callback) => callback({ pokemon: MOCK_STATE_SUCCESS }));

        const { result } = renderHook(() => usePokemonDetail());

        expect(result.current.pokemon).toEqual({ id: 1, name: 'bulbasaur' });
        expect(result.current.loading).toBe(false);
    });
});