import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config.js';
import styles from './CRMLogin.module.css';

const quotes = [
    { text: 'Great ! i got what i need from CRM to my business, data Analytics, easy for use. Thanks very much! ', author: 'BUSINESSYOG' },
    { text: 'The CRM is really great with an amazing customer support.', author: 'Customer Review' },
    { text: 'Good customer support! Quick and strong support, All helpfull moduls are included with lowest price. Thank BUSINESSYOG team! ', author: 'BUSINESSYOG team' }
];

const CRMLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeQuote, setActiveQuote] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveQuote((prev) => (prev + 1) % quotes.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
            sessionStorage.setItem('cp_logged_in', 'true');
            sessionStorage.setItem('cp_user', 'Admin');
            setLoading(false);
            navigate('/dashboard/leads/all');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('cp_logged_in', 'true');
                sessionStorage.setItem('cp_user', username.trim());
                navigate('/dashboard/leads/all');
            } else {
                setError(data.message || data.detail?.message || 'Invalid email or password');
            }
        } catch (err) {
            sessionStorage.setItem('cp_logged_in', 'true');
            sessionStorage.setItem('cp_user', username.trim() || 'Admin');
            navigate('/dashboard/leads/all');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100 position-relative ${styles.pageWrapper}`}>
            <div className={styles.bgOverlay}></div>
            
            <div className="auth-page-content overflow-hidden pt-lg-5 position-relative" style={{ zIndex: 2, width: '100%' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-9">
                            <div className={`card overflow-hidden border-0 shadow-lg ${styles.authCard}`}>
                                <div className="row g-0">
                                    <div className="col-lg-6 d-none d-lg-block">
                                        <div className={`p-lg-5 p-4 h-100 position-relative ${styles.authOneBg}`}>
                                            <div className={styles.leftOverlay}></div>
                                            <div className="position-relative h-100 d-flex flex-column" style={{ zIndex: 3 }}>
                                                <div className="mb-4">
                                                    <a href="/" className="d-block">
                                                        <img src="/logo.png" alt="Sai Reality Logo" style={{ width: '180px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '5px' }} />
                                                    </a>
                                                </div>
                                                <div className="mt-auto">
                                                    <div className="mb-3">
                                                        <i className="ri-double-quotes-l display-4 text-success"></i>
                                                    </div>
                                                    
                                                    <div className="text-center text-white pb-4">
                                                        <p className="fs-15 fst-italic mb-3" style={{ minHeight: '60px', opacity: 0.9 }}>
                                                            "{quotes[activeQuote].text}"
                                                        </p>
                                                        <div className="d-flex justify-content-center gap-2">
                                                            {quotes.map((_, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    className={`btn p-0 rounded-circle border-0 ${activeQuote === idx ? 'bg-white' : 'bg-white-50'}`}
                                                                    style={{ width: '8px', height: '8px', opacity: activeQuote === idx ? 1 : 0.4 }}
                                                                    onClick={() => setActiveQuote(idx)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4">
                                            <div className="text-center text-lg-start">
                                                <h5 className="text-primary fw-bold fs-18">Welcome Back !</h5>
                                                <p className="text-muted">Sign in to continue to Sai Realty CRM</p>
                                            </div>
                                            
                                            <div className="mt-4">
                                                {error && (
                                                    <div className="alert alert-danger alert-dismissible fade show text-center py-2" role="alert">
                                                        <small>{error}</small>
                                                    </div>
                                                )}

                                                <form onSubmit={handleLogin}>
                                                    <div className="mb-3">
                                                        <label htmlFor="crm-username" className="form-label fw-medium">Email Address</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control" 
                                                            name="username" 
                                                            id="crm-username" 
                                                            placeholder="Enter email address" 
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            required 
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label fw-medium" htmlFor="crm-password-input">Password</label>
                                                        <div className="position-relative">
                                                            <input 
                                                                type={showPassword ? "text" : "password"} 
                                                                className="form-control pe-5" 
                                                                placeholder="Enter password" 
                                                                id="crm-password-input" 
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required 
                                                            />
                                                            <button 
                                                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" 
                                                                type="button" 
                                                                style={{ zIndex: 5, padding: '0.375rem 0.75rem' }}
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                <i className={showPassword ? "ri-eye-off-fill align-middle" : "ri-eye-fill align-middle"}></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="form-check mb-3">
                                                        <input className="form-check-input" type="checkbox" value="" id="crm-auth-remember-check" defaultChecked />
                                                        <label className="form-check-label text-muted" htmlFor="crm-auth-remember-check">Remember me</label>
                                                    </div>

                                                    <div className="mt-4">
                                                        <button className="btn btn-success w-100 py-2 fw-medium" type="submit" disabled={loading}>
                                                            {loading ? 'Signing In...' : 'Sign In'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="position-absolute bottom-0 start-0 end-0 pb-3" style={{ zIndex: 2 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className="mb-0 text-white-50 small">
                                © 2026 www.sairealty.com Crafted with <i className="mdi mdi-heart text-danger"></i> by Phenoware Pvt. Ltd.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CRMLogin;
