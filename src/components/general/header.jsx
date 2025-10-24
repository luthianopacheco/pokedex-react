import { Link } from 'react-router';
import LogoImage from '../../assets/logo/pokémon.png';
import './header.css'

export default function Header() {
    return (
        <header className='header'>
            <nav >
                <Link to="/" >
                    <img src={LogoImage} alt='Pokédex' style={{ width: '100px' }} />
                </Link>
            </nav>
        </header>
    );
}