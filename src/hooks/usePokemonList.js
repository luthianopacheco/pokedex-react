import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPaginatedPokemonDetails,
    getFullPokemonList,
    resetSearch,
    resetCurrentPokemon,
    clearPaginatedList
} from '../redux/pokemonSlice';

const POKEMONS_PER_PAGE = 20;

export function usePokemonList() {
    const dispatch = useDispatch();

    const {
        paginatedList,
        loadingPaginated,
        paginatedError,
        fullList,
        loadingFullList,
        fullListError
    } = useSelector((state) => state.pokemon);

    const [offset, setOffset] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [_, setCurrentSearchTerm] = useState('');
    const [filteredCacheList, setFilteredCacheList] = useState([]);
    const [currentDisplayList, setCurrentDisplayList] = useState([]);


    const applyPagination = useCallback((sourceList, newOffset) => {
        const start = newOffset;
        const end = newOffset + POKEMONS_PER_PAGE;
        const paginated = sourceList.slice(start, end);

        setCurrentDisplayList(paginated);
        setOffset(newOffset);

    }, []);

    const fetchPaginatedDetails = useCallback((newOffset) => {
        setIsSearching(false);
        setCurrentSearchTerm('');
        setFilteredCacheList([]);

        dispatch(clearPaginatedList());

        const basicPokemonsForPage = fullList.slice(newOffset, newOffset + POKEMONS_PER_PAGE);

        dispatch(getPaginatedPokemonDetails(basicPokemonsForPage));
        setOffset(newOffset);
    }, [dispatch, fullList]);


    useEffect(() => {
        if (paginatedError || fullListError) {
            console.error("Erro detectado, interrompendo chamadas recorrentes à API.");
            return;
        }

        dispatch(resetCurrentPokemon());

        if (fullList.length === 0 && !loadingFullList) {
            dispatch(getFullPokemonList());
            return;
        }

        if (fullList.length > 0 && !loadingPaginated && !isSearching) {
            if (offset === 0 && paginatedList.length === 0) {
                fetchPaginatedDetails(0);
            }
        }
    }, [
        dispatch,
        fullList.length,
        loadingFullList,
        fullListError,
        fetchPaginatedDetails,
        paginatedList.length,
        loadingPaginated,
        paginatedError,
        isSearching,
        offset
    ]);

    useEffect(() => {
        if (!isSearching && !loadingPaginated) {
            setCurrentDisplayList(paginatedList);
        }
    }, [paginatedList, isSearching, loadingPaginated]);

    useEffect(() => {
        if (isSearching) {
            applyPagination(filteredCacheList, offset);
        }
    }, [filteredCacheList, isSearching, offset, applyPagination]);


    const getFilteredResults = (term) => {
        return fullList.filter(pokemon =>
            pokemon.name.includes(term.toLowerCase()) || String(pokemon.id).includes(term.toLowerCase())
        );
    };

    const handleSearch = (searchTerm) => {
        if (loadingFullList || fullList.length === 0) {
            alert("Aguarde o carregamento completo da PokéDex para iniciar a pesquisa. Tente novamente em alguns segundos.");
            return;
        }

        setIsSearching(true);
        dispatch(resetSearch());
        const term = searchTerm.toLowerCase();
        const filtered = getFilteredResults(term);
        setFilteredCacheList(filtered);
        setCurrentSearchTerm(term);
        setOffset(0);
    };

    const handleReset = () => {
        dispatch(resetSearch());
        setIsSearching(false);
        setFilteredCacheList([]);
        fetchPaginatedDetails(0);
    };

    const handlePageChange = (page) => {
        const newOffset = (page - 1) * POKEMONS_PER_PAGE;

        if (isSearching) {
            applyPagination(filteredCacheList, newOffset);
        } else {
            fetchPaginatedDetails(newOffset);
        }
    };

    const currentListCount = isSearching ? filteredCacheList.length : fullList.length;
    const totalPages = Math.ceil(currentListCount / POKEMONS_PER_PAGE);
    const currentPage = Math.floor(offset / POKEMONS_PER_PAGE) + 1;
    const isCacheReady = fullList.length > 0 && fullList.every(p => p.id);

    return {
        pokemons: currentDisplayList,
        loading: loadingPaginated || loadingFullList,
        error: paginatedError || fullListError,
        totalPages,
        currentPage,
        isSearching,
        isCacheReady,
        handleSearch,
        handleReset,
        handlePageChange,
    };
}