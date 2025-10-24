import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getPokemonDetails, resetCurrentPokemon } from '../redux/pokemonSlice';

export function usePokemonDetail() {
    const { nameOrId } = useParams();
    const dispatch = useDispatch();

    const {
        currentPokemon: pokemon,
        loadingDetail: loading,
        errorDetail: error
    } = useSelector((state) => state.pokemon);

    useEffect(() => {
        if (nameOrId && typeof nameOrId === 'string') {
            const identifier = nameOrId.trim().toLowerCase();

            if (identifier) {
                dispatch(getPokemonDetails(identifier));
            }
        }

        return () => {
            dispatch(resetCurrentPokemon());
        };

    }, [dispatch, nameOrId]);

    return {
        pokemon,
        loading,
        error
    };
}