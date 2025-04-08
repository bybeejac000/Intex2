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
                            <div className="d-flex align-items-center justify-content-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    fill="#1976d2"
                                    className="bi bi-arrow-left-circle me-3"
                                    viewBox="0 0 16 16"
                                    style={{ cursor: 'pointer', paddingLeft: '10px' }}
                                    onClick={() => navigate(-1)}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                                    />
                                </svg>
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
