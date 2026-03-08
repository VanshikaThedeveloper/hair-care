import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!formData.name || formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
        if (!formData.password || formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirm) errs.confirm = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(formData.name.trim(), formData.email, formData.password);
            toast.success('Welcome to Vertex! Your account has been created.');
            navigate('/home');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const field = (key) => ({
        value: formData[key],
        onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
        className: `form-input input-with-icon ${errors[key] ? 'error' : ''}`,
    });

    return (
        <>
            <Helmet>
                <title>Create Account | Vertex Hair Care</title>
                <meta name="description" content="Join Vertex Hair Care. Create your account and experience the gold standard in luxury hair care." />
            </Helmet>
            <div className="auth-page">
                <div className="auth-bg" />
                <div className="auth-container">
                    <div className="auth-card glass-card">
                        <div className="auth-logo">
                            <span className="auth-logo-text">VERTEX</span>
                            <span className="auth-logo-sub">HAIR CARE</span>
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join the luxury hair care experience</p>

                        <form onSubmit={handleSubmit} className="auth-form" noValidate>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-icon-wrap">
                                    <FiUser className="input-icon" />
                                    <input type="text" placeholder="Your full name" {...field('name')} />
                                </div>
                                {errors.name && <p className="form-error">{errors.name}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="input-icon-wrap">
                                    <FiMail className="input-icon" />
                                    <input type="email" placeholder="your@email.com" {...field('email')} />
                                </div>
                                {errors.email && <p className="form-error">{errors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-icon-wrap">
                                    <FiLock className="input-icon" />
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" {...field('password')} />
                                    <button type="button" className="input-icon-right" onClick={() => setShowPassword((p) => !p)}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="form-error">{errors.password}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-icon-wrap">
                                    <FiLock className="input-icon" />
                                    <input type="password" placeholder="Repeat your password" {...field('confirm')} />
                                </div>
                                {errors.confirm && <p className="form-error">{errors.confirm}</p>}
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn" style={{ marginTop: 12 }} disabled={loading}>
                                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
