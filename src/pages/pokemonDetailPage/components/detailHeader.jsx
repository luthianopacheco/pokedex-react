import { Stack, capitalize } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowBack';
import TypeChip from '../../../components/chip/typeChip';
import { useNavigate } from 'react-router';
import './detailHeader.css';

export default function DetailHeader({ pokemon, contrastColor, }) {
    const navigate = useNavigate();
    const imageUrl = pokemon?.sprites.other['official-artwork']?.front_default || pokemon?.sprites.front_default;

    return (
        <div className="detail-header">
            <button onClick={() => navigate(-1)} className="back-button">
                <ArrowIcon />
            </button>

            <Stack direction={'row'} sx={{
                width: '100%',
                justifyContent: 'space-between',
                marginTop: '40px'
            }}>
                <div className="column-name-types" >
                    <h1 className="pokemon-detail-name" style={{ color: contrastColor }}>
                        {capitalize(pokemon.name)}
                    </h1>
                    <div style={{ margin: '10px 0' }}>
                        <TypeChip types={pokemon?.types} spacing={2} />
                    </div>
                </div>
                <span className="pokemon-detail-id" style={{ color: contrastColor }}>
                    #{String(pokemon?.id).padStart(5, '0')}
                </span>
            </Stack>

            <img className="pokemon-detail-image" src={imageUrl} alt={pokemon?.name} />
        </div>
    );
}