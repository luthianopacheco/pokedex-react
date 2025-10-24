import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { CircularProgress } from '@mui/material';
import { getTypeColorWithOpacity, getContrastColor } from '../../utils/colorUtils';
import { useState } from 'react';
import ErrorComponent from '../../components/error/errorComponent';
import DetailHeader from './components/detailHeader';
import DetailTabs from './components/detailTab';
import './pokemonDetailPage.css';

const TAB_INDICES = {
    'about': 0,
    'stats': 1,
    'evolution': 2
};
export default function PokemonDetailPage() {
    const [activeTab, setActiveTab] = useState('about');
    const [slideDirection, setSlideDirection] = useState('left');
    const {
        pokemon,
        loading,
        error,
    } = usePokemonDetail();

    const handleTabChange = (newTab) => {
        const oldIndex = TAB_INDICES[activeTab];
        const newIndex = TAB_INDICES[newTab];

        if (newIndex > oldIndex) {
            setSlideDirection('left');
        } else if (newIndex < oldIndex) {
            setSlideDirection('right');
        }

        setActiveTab(newTab);
    };

    const firstType = pokemon?.types[0]?.type.name || 'default';
    const mainColor = getTypeColorWithOpacity({ type: firstType, opacity: 1 });
    const pokemonNameError = pokemon?.name ?? 'Pokémon'


    if (loading) return <CircularProgress />

    if (error || !pokemon) return (<ErrorComponent
        errorMessage={`Erro ao obter detalhes do ${pokemonNameError}`}
        showHomeButton={true}
    />);

    return (
        <div className="detail-page-container " style={{ backgroundColor: mainColor }}>
            <DetailHeader pokemon={pokemon} contrastColor={getContrastColor(mainColor)} />
            <DetailTabs
                activeTab={activeTab}
                slideDirection={slideDirection}
                handleTabChange={handleTabChange}
                pokemon={pokemon}
            />
        </div >

    );
}