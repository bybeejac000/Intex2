import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaReddit, FaTiktok } from 'react-icons/fa';

function Footer() {
    return (
        <footer style={{
            backgroundColor: '#010f1e',
            color: 'white',
            padding: '1rem 2rem',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100vw',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Copyright */}
            <div style={{ fontSize: '0.9rem' }}>
                © {new Date().getFullYear()} CineNiche
            </div>

            {/* Main Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>About</Link>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</Link>
                <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy</Link>
                <Link to="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Terms</Link>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><FaFacebook /></a>
                <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><FaInstagram /></a>
                <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><FaTwitter /></a>
                <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><FaReddit /></a>
                <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}><FaTiktok /></a>
            </div>
        </footer>
    );
}

export default Footer; 