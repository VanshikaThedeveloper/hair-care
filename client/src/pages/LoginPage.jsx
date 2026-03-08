import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!formData.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
        if (!formData.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back to Vertex!');
            navigate('/home');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Vertex Hair Care</title>
                <meta name="description" content="Login to your Vertex Hair Care account to access exclusive products, orders, and more." />
            </Helmet>
            <div className="auth-page">
                <div className="auth-bg" />
                <div className="auth-container">
                    <div className="auth-card glass-card">
                        <div className="auth-logo">
                            <span className="auth-logo-text">VERTEX</span>
                            <span className="auth-logo-sub">HAIR CARE</span>
                        </div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to your luxury experience</p>

                        <form onSubmit={handleSubmit} className="auth-form" noValidate>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="input-icon-wrap">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email" value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && <p className="form-error">{errors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-icon-wrap">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`form-input input-with-icon ${errors.password ? 'error' : ''}`}
                                        placeholder="Enter your password"
                                    />
                                    <button type="button" className="input-icon-right" onClick={() => setShowPassword((p) => !p)}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="form-error">{errors.password}</p>}
                            </div>

                            <div className="auth-forgot">
                                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
