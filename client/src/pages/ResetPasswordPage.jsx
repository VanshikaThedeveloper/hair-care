import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        if (password !== confirm) { toast.error('Passwords do not match'); return; }

        setLoading(true);
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Token invalid or expired');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password | Vertex Hair Care</title>
            </Helmet>
            <div className="auth-page">
                <div className="auth-bg" />
                <div className="auth-container">
                    <div className="auth-card glass-card">
                        <h1 className="auth-title">New Password</h1>
                        <p className="auth-subtitle">Create a secure new password for your account</p>

                        <form onSubmit={handleSubmit} className="auth-form" noValidate>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="input-icon-wrap">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input input-with-icon"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                    <button type="button" className="input-icon-right" onClick={() => setShowPassword((p) => !p)}>
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-icon-wrap">
                                    <FiLock className="input-icon" />
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="form-input input-with-icon"
                                        placeholder="Repeat new password"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordPage;
