import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', {
                name: form.name,
                phone: form.phone,
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                },
            });
            updateUser(data.user);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>My Profile | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main className="profile-page">
                <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
                    <div className="profile-layout">
                        <div className="profile-sidebar glass-card">
                            <div className="profile-avatar">{user?.name?.[0]}</div>
                            <h2 className="profile-name">{user?.name}</h2>
                            <p className="profile-role">{user?.role === 'admin' ? 'Administrator' : 'Exclusive Member'}</p>
                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span>Joined</span>
                                    <span>{new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content glass-card">
                            <h3 className="section-title" style={{ textAlign: 'left', fontSize: '1.4rem' }}>Personal Information</h3>
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="checkout-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-icon-wrap">
                                            <FiUser className="input-icon" />
                                            <input name="name" value={form.name} onChange={handleChange} className="form-input input-with-icon" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <div className="input-icon-wrap">
                                            <FiMail className="input-icon" />
                                            <input value={user?.email} className="form-input input-with-icon" disabled style={{ opacity: 0.6 }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-icon-wrap">
                                        <FiPhone className="input-icon" />
                                        <input name="phone" value={form.phone} onChange={handleChange} className="form-input input-with-icon" placeholder="+91 XXXXXXXXXX" />
                                    </div>
                                </div>

                                <h3 className="section-title" style={{ textAlign: 'left', fontSize: '1.2rem', marginTop: 32, marginBottom: 20 }}>Default Shipping Address</h3>
                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <div className="input-icon-wrap">
                                        <FiMapPin className="input-icon" />
                                        <input name="street" value={form.street} onChange={handleChange} className="form-input input-with-icon" placeholder="House no, Street area" />
                                    </div>
                                </div>
                                <div className="checkout-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="City" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input name="state" value={form.state} onChange={handleChange} className="form-input" placeholder="State" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pincode</label>
                                        <input name="pincode" value={form.pincode} onChange={handleChange} className="form-input" placeholder="6 digits" maxLength={6} />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }} disabled={loading}>
                                    {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FiSave /> Save Changes</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProfilePage;
