import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';
import ScrollingPosters from '../components/ScrollingPosters';
import { useState } from 'react';

function LoginPage() {
    // State variables for email, password, and remember me checkbox
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberme, setRememberme] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        if (type === 'checkbox') {
            setRememberme(checked);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Clear any previous error messages

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const loginUrl = rememberme
            ? 'https://localhost:5000/login?useCookies=true'
            : 'https://localhost:5000/login?useSessionCookies=true';

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data = null;
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > 0) {
                data = await response.json();
            }

            if (!response.ok) {
                throw new Error(data?.message || 'Invalid email or password.');
            }

            navigate('/movies');
        } catch (error: any) {
            setError(error.message || 'Error logging in.');
            console.error('Fetching attempt failed:', error);
        }
    };

    return (
        <>
            <Header />
            <div
                className="container-fluid p-0 min-vh-100"
                style={{
                    backgroundImage: 'linear-gradient(135deg, #000810 0%, #00294D 100%)',
                    overflow: 'hidden',
                    margin: 0,
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <div className="row g-0 h-100">
                    {/* Left side - 1/3 of the screen */}
                    <div className="col-md-4">
                        <ScrollingPosters />
                    </div>

                    {/* Right side - 2/3 of the screen */}
                    <div className="col-md-8 d-flex flex-column justify-content-center align-items-center text-light" style={{ height: '100vh' }}>
                        <div className="text-center mb-5">
                            <div className="text-center mb-5 d-flex align-items-center justify-content-center">
                            <button 
                                className="btn btn-link text-light text-decoration-none me-3" 
                                onClick={() => window.history.back()}
                                style={{ fontSize: '2.25rem' }}
                            >
                                ←
                            </button>
                                <h1 className="display-1 fw-light mb-0">Log In</h1>
                            </div>
                            <form
                                className="d-flex flex-column gap-3"
                                style={{ maxWidth: '300px', margin: '0 auto' }}
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="form-control form-control-lg"
                                />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="form-control form-control-lg"
                                />
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="rememberme"
                                        name="rememberme"
                                        checked={rememberme}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="rememberme">
                                        Remember password
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-lg"
                                    style={{
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        padding: '15px 30px',
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/movies')}
                                    className="btn btn-lg"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#1976d2',
                                        border: '2px solid #1976d2',
                                        padding: '15px 30px',
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    Access Movies (Placeholder)
                                </button>
                            </form>
                            {error && <p className="error">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default LoginPage;
