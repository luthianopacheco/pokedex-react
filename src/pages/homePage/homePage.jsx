import { usePokemonList } from '../../hooks/usePokemonList';
import Pagination from '../../components/general/pagination';
import SearchBar from '../../components/searchBar/searchBar';
import LogoImage from '../../assets/logo/pokédex.png'
import { CircularProgress } from '@mui/material';
import ErrorComponent from '../../components/error/errorComponent';
import PokemonGrid from '../../components/pokemonGrid/pokemonGrid';
import './homePage.css'

export default function HomePage() {
    const {
        pokemons,
        loading,
        error,
        totalPages,
        currentPage,
        isSearching,
        handleSearch,
        handleReset,
        handlePageChange,
    } = usePokemonList();

    if (loading) return (<CircularProgress />);

    if (error) return (<ErrorComponent errorMessage={'Erro ao carregar os Pokémons'} />);

    return (
        <div className='home-body' >
            <img className='main-image' src={LogoImage} alt='Pokédex' />

            <SearchBar onSearch={handleSearch} onReset={handleReset} />

            <PokemonGrid pokemons={pokemons} isSearching={isSearching} />

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}