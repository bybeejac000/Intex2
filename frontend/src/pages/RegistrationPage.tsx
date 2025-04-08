import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';
import ScrollingPosters from '../components/ScrollingPosters';

function RegistrationPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        zipcode: '',
        state: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        if (step < 7) setStep(step + 1);
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
    };

    const buttonStyle = {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '15px 30px',
        fontSize: '1.2rem',
        height: '50px',
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <input 
                        type="text" 
                        name="firstName"
                        placeholder="First Name" 
                        className="form-control form-control-lg"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                );
            case 2:
                return (
                    <input 
                        type="text" 
                        name="lastName"
                        placeholder="Last Name" 
                        className="form-control form-control-lg"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                );
            case 3:
                return (
                    <input 
                        type="text" 
                        name="zipcode"
                        placeholder="Zipcode" 
                        className="form-control form-control-lg"
                        value={formData.zipcode}
                        onChange={handleChange}
                    />
                );
            case 4:
                return (
                    <input 
                        type="text" 
                        name="state"
                        placeholder="State" 
                        className="form-control form-control-lg"
                        value={formData.state}
                        onChange={handleChange}
                    />
                );
            case 5:
                return (
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address" 
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                    />
                );
            case 6:
                return (
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                    />
                );
            case 7:
                return (
                    <div className="text-center">
                        <h2>Confirm Your Details</h2>
                        <br />
                        <p>First Name: {formData.firstName}</p>
                        <p>Last Name: {formData.lastName}</p>
                        <p>Zipcode: {formData.zipcode}</p>
                        <p>State: {formData.state}</p>
                        <p>Email: {formData.email}</p>
                        <br />
                        <button 
                            type="submit" 
                            className="btn btn-lg"
                            style={buttonStyle}
                        > Confirm and Register
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

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
                            <form className="d-flex flex-column gap-3" style={{ maxWidth: '300px', margin: '0 auto' }} onSubmit={handleSubmit}>
                                {renderStep()}
                                <div className="d-flex justify-content-center gap-3">
                                    {step === 7 && <button 
                                        type="submit" 
                                        className="btn btn-sm"
                                        style={buttonStyle} 
                                        onClick={() => setStep(1)}
                                    >Go Back and Edit</button>}
                                    {step < 7 && <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>}
                                </div>
                                <div className="mt-3">
                                    <p>Step {step} of 7</p>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" style={{ width: `${(step / 7) * 100}%` }} aria-valuenow={step} aria-valuemin={1} aria-valuemax={7}></div>
                                    </div>
                                </div>
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