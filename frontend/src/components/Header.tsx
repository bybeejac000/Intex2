import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';

function Header() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    let timeoutId: number | undefined;

    useEffect(() => {
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const handleMouseEnter = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutId = window.setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200);
    };

    return (
        <header className="fixed-top" style={{
            backgroundColor: '#010f1e',
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
            <div 
                ref={dropdownRef}
                style={{ 
                    position: 'absolute', 
                    right: '25px', 
                    top: '1rem',
                    cursor: 'pointer'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <FontAwesomeIcon 
                    icon={faUserCircle} 
                    size="2x" 
                    color="white" 
                    style={{
                        transition: 'transform 0.2s ease',
                        transform: isDropdownOpen ? 'scale(1.1)' : 'scale(1)'
                    }}
                />
                {isDropdownOpen && (
                    <div 
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            backgroundColor: '#0a1929',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '0.5rem 0',
                            minWidth: '180px',
                            zIndex: 1001,
                            marginTop: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            animation: 'fadeIn 0.2s ease'
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link 
                            to="/profile" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1.25rem',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'background-color 0.2s ease',
                                gap: '10px'
                            }}
                            className="hover-effect"
                        >
                            <FontAwesomeIcon icon={faUser} />
                            <span>Profile</span>
                        </Link>
                        <Link 
                            to="/admin" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1.25rem',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'background-color 0.2s ease',
                                gap: '10px'
                            }}
                            className="hover-effect"
                        >
                            <FontAwesomeIcon icon={faCog} />
                            <span>Admin</span>
                        </Link>
                    </div>
                )}
            </div>
            <style>
                {`
                    .hover-effect:hover {
                        background-color: rgba(255,255,255,0.1);
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </header>
    );
}

export default Header;
