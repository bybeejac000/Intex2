import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const navigate = useNavigate();

    return (
        <header className="fixed-top" style={{
            backgroundColor: '#0a1929',
            padding: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 1000
        }}>
            <div 
                onClick={() => navigate('/')} 
                style={{ cursor: 'pointer' }}
            >
                <h1 className="text-start text-light display-6 mb-0" style={{ marginLeft: '25px', fontSize: '1.75rem' }}>CineNiche</h1>
            </div>
            <div style={{ position: 'absolute', right: '25px', top: '1rem', cursor: 'pointer' }}>
            <Link to="/profile">
                <FontAwesomeIcon icon={faUserCircle} size="2x" color="white" />
            </Link>
            </div>
        </header>
    );
}

export default Header;
