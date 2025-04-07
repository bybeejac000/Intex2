import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';
import ScrollingPosters from '../components/ScrollingPosters';

function RegistrationPage() {
    const navigate = useNavigate();
    return (
        <>
            <Header />
            <div className="container-fluid p-0 min-vh-100" style={{
                backgroundColor: '#0a1929',
                overflow: 'hidden',
                margin: 0,
                width: '100vw',
                height: '100vh'
            }}>
                <div className="row g-0 h-100">
                    {/* Left side - 1/3 of the screen */}
                    <div className="col-md-4">
                        <ScrollingPosters />
                    </div>

                    {/* Right side - 2/3 of the screen */}
                    <div className="col-md-8 d-flex flex-column justify-content-center align-items-center text-light" style={{ height: '100vh' }}>
                        <div className="text-center mb-5">
                            <h1 className="display-1 fw-light mb-4">Register for an Account</h1>
                            <form className="d-flex flex-column gap-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    className="form-control form-control-lg"
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    className="form-control form-control-lg"
                                />
                                <button 
                                    type="submit" 
                                    className="btn btn-lg"
                                    style={{ 
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        padding: '15px 30px',
                                        fontSize: '1.2rem'
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
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    Access Movies (Placeholder)
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RegistrationPage;