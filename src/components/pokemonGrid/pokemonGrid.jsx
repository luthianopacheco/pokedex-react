import PokemonCard from '../pokemonCard/pokemonCard';
import './pokemonGrid.css'

export default function PokemonGrid({ pokemons, isSearching }) {
    if (pokemons.length === 0 && isSearching) {
        return <h2>Pokémon não encontrado.</h2>;
    }

    if (pokemons.length === 0) {
        return <h2>Nenhum Pokémon para exibir.</h2>;
    }

    return (
        <div className='pokemon-list'>
            {pokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
        </div>
    );
}