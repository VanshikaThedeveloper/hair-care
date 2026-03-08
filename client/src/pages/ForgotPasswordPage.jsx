import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiChevronLeft } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { toast.error('Please enter your email'); return; }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent to your email');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password | Vertex Hair Care</title>
            </Helmet>
            <div className="auth-page">
                <div className="auth-bg" />
                <div className="auth-container">
                    <div className="auth-card glass-card">
                        <Link to="/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
                            <FiChevronLeft /> Back to Login
                        </Link>
                        <h1 className="auth-title">Reset Password</h1>
                        <p className="auth-subtitle">
                            {sent ? 'Check your inbox for the reset link' : 'Enter your email to receive a password reset link'}
                        </p>

                        {!sent ? (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-icon-wrap">
                                        <FiMail className="input-icon" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input input-with-icon"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                                    {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send Reset Link'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                                    We've sent an email with instructions on how to reset your password.
                                </p>
                                <button className="btn btn-outline" onClick={() => setSent(false)}>
                                    Resend Email
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
