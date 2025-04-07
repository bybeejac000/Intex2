import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import Header from '../components/Header';
import ScrollingPosters from '../components/ScrollingPosters';
import Footer from '../components/Footer';


function HomePage() {
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
                        <h1 className="display-1 fw-light" style={{ color: '#ffffff' }}>CineNiche</h1>
                        <p className="lead text-light-50">Subtitle Here</p>
                    </div>
                    <div className="d-grid gap-3 col-md-6 mx-auto">
                        <button 
                            className="btn btn-lg" 
                            onClick={() => navigate('/login')}
                            style={{ 
                                backgroundColor: '#1976d2',
                                color: 'white',
                                padding: '15px 30px',
                                fontSize: '1.2rem'
                            }}
                        >
                            Log In
                        </button>
                        <button 
                            className="btn btn-lg" 
                            onClick={() => navigate('/registration')}
                            style={{ 
                                backgroundColor: 'transparent',
                                color: '#1976d2',
                                border: '2px solid #1976d2',
                                padding: '15px 30px',
                                fontSize: '1.2rem'
                            }}
                        >Register
                        </button>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </>
    );
}

export default HomePage;


