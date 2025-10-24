import { useNavigate } from 'react-router';
import { capitalize } from '@mui/material';
import TypeChip from '../chip/typeChip';
import './pokemonCard.css';
import PokemonImageContainer from './pokemonImageContainer';

export default function PokemonCard({ pokemon }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/pokemon/${pokemon.name}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick();
        }
    };

    const getImageUrl = (p) => {
        const official = p.sprites?.front_default;
        const standard = p.sprites?.other?.['official-artwork']?.front_default;
        const animated = p.sprites?.other.showdownfront_default;
        return official || standard || animated;
    };

    const imageUrl = getImageUrl(pokemon);

    return (
        <div
            className="pokemon-card"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex="0"
        >
            <PokemonImageContainer imageUrl={imageUrl} name={pokemon.name} />

            <p className="pokemon-id">#{String(pokemon.id).padStart(5, '0')}</p>

            <h3 className="pokemon-name">{capitalize(pokemon.name)}</h3>

            <TypeChip types={pokemon.types} />
        </div >
    );
}