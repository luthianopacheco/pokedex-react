import linkedinLogo from '../../assets/socialMedia/linkedin.svg';
import githubLogo from '../../assets/socialMedia/github.svg';
import mailLogo from '../../assets/socialMedia/mail.svg';
import './footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>&copy; {currentYear} Pokédex Project</p>
                <div className="social-links">
                    <a href="https://www.linkedin.com/in/luthiano-pacheco/" target="_blank" rel="noopener noreferrer" title='LinkedIn'>
                        <img src={linkedinLogo} alt='Linkedin' />
                    </a>
                    <a href="https://github.com/luthianopacheco/" target="_blank" rel="noopener noreferrer" title='GitHub'>
                        <img src={githubLogo} alt='GitHub' />
                    </a>
                    <a href="mailto:luthianopacheco@gmail.com" target="_blank" rel="noopener noreferrer" title='Email'>
                        <img src={mailLogo} alt='Email' />
                    </a>
                </div>
            </div>
        </footer>
    );
}