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
        if (step < 8) setStep(step + 1);
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
    };

    const buttonStyle = {
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '10px 20px',  // Adjusted padding to make it thinner
        fontSize: '1.2rem',
        height: '50px',
        textAlign: 'center',   // Ensures the text is centered
        display: 'inline-flex', // Makes the button inline so text can be centered
        justifyContent: 'center', // Ensures the content is centered
        alignItems: 'center',    // Ensures vertical alignment of text
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your first name?</h5>
                    <input 
                        type="text" 
                        name="firstName"
                        placeholder="First Name" 
                        className="form-control form-control-lg"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    </div>
                );
            case 2:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your last name?</h5>
                    <input 
                        type="text" 
                        name="lastName"
                        placeholder="Last Name" 
                        className="form-control form-control-lg"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    </div>
                );
            case 3:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your zip code?</h5>
                    <input 
                        type="text" 
                        name="zipcode"
                        placeholder="Zipcode" 
                        className="form-control form-control-lg"
                        value={formData.zipcode}
                        onChange={handleChange}
                    />
                    </div>
                );
            case 4:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your state?</h5>
                    <input 
                        type="text" 
                        name="state"
                        placeholder="State" 
                        className="form-control form-control-lg"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    </div>
                );
            case 5:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your phone number?</h5>
                    <input 
                        type="phone" 
                        name="phone"
                        placeholder="Phone Number" 
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    </div>
                );

            case 6:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">What's your email address?</h5>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address" 
                        className="form-control form-control-lg"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    </div>
                );
            case 7:
                return (
                    <div className="mb-3">
                    <h5 className="mb-4">Create a password</h5>
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        className="form-control form-control-lg"
                        value={formData.password}
                        onChange={handleChange}
                    />  
                    <p>Password must contain at least 15 characters</p>
                    </div>
                );
            case 8:
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
                            style={{
                                backgroundColor: buttonStyle.backgroundColor,
                                color: buttonStyle.color,
                                padding: buttonStyle.padding,
                                fontSize: buttonStyle.fontSize,
                                height: buttonStyle.height,
                                textAlign: "center" as const,
                                display: buttonStyle.display,
                                justifyContent: buttonStyle.justifyContent,
                                alignItems: buttonStyle.alignItems,
                                width: '300px'
                            }}
                        >Confirm and Register
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
                backgroundImage: 'linear-gradient(135deg, #000810 0%, #00294D 100%)',
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
                        <div className="text-center mb-5 d-flex align-items-center justify-content-center">
                            <button 
                                className="btn btn-link text-light text-decoration-none me-3" 
                                onClick={() => window.history.back()}
                                style={{ fontSize: '2.25rem' }}
                            >
                                ←
                            </button>
                            <h1 className="display-1 fw-light mb-4" style={{paddingTop: "100px"}}>Register for an Account</h1>
                        </div>
                        <br />
                        <br />
                        <form className="d-flex flex-column gap-3" style={{ maxWidth: '300px', margin: '0 auto' }} onSubmit={handleSubmit}>
                            {renderStep()}
                            <div className="d-flex justify-content-center gap-3">
                                {step === 8 && <button 
                                    type="submit" 
                                    className="btn btn-lg"
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '2px solid #1976d2',
                                        color: '#1976d2',
                                        padding: buttonStyle.padding,
                                        fontSize: buttonStyle.fontSize,
                                        height: buttonStyle.height,
                                        textAlign: "center" as const,
                                        display: buttonStyle.display,
                                        justifyContent: buttonStyle.justifyContent,
                                        alignItems: buttonStyle.alignItems,
                                        width: '500px'
                                    }}
                                    onClick={() => setStep(1)}
                                >Go Back and Edit</button>}
                                {step < 8 && <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>}
                            </div>
                            <div className="mt-3">
                                <p>Step {step} of 8</p>
                                <div className="progress" style={{marginBottom: "100px"}}>
                                    <div className="progress-bar" role="progressbar" style={{ width: `${(step / 8) * 100}%` }} aria-valuenow={step} aria-valuemin={1} aria-valuemax={8}></div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RegistrationPage;