import { AsyncImage } from '../image/asyncImage';
import './pokemonCard.css'

const IMAGE_STYLE = {
    position: 'relative',
    zIndex: '2',
    width: '150px',
    height: '150px',
    marginTop: '10px',
};

export default function PokemonImageContainer({ imageUrl, name }) {
    if (!imageUrl) return (
        <div className="image-container">
            <div className="no-image-slot">Sem imagem</div>
        </div >
    )

    return (
        <div className="image-container">
            <div className="image-fade-gradient" />
            <AsyncImage src={imageUrl} alt={name} style={IMAGE_STYLE} />
        </div>
    );
}