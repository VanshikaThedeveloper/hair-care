import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.message.trim()) { toast.error('Please enter a message'); return; }
        setLoading(true);
        try {
            await api.post('/contact', form);
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        // [REPLACE] with actual contact details
        { Icon: FiMail, label: 'Email', value: 'support@vertex.com', href: 'mailto:support@vertex.com' },
        { Icon: FiPhone, label: 'Phone', value: '+91 XXXXXXXXXX', href: 'tel:+91XXXXXXXXXX' },
        { Icon: FiMapPin, label: 'Address', value: 'Mumbai, Maharashtra, India', href: '#' },
    ];

    return (
        <>
            <Helmet>
                <title>Contact Us | Vertex Hair Care</title>
                <meta name="description" content="Get in touch with the Vertex Hair Care team. We're here to help with orders, product queries, and anything else." />
            </Helmet>
            <Navbar />
            <main>
                <div className="contact-hero">
                    <div className="contact-hero__bg" />
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <h1 className="section-title">Get in <span className="text-gold">Touch</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                            We'd love to hear from you. Our team usually responds within 24 hours.
                        </p>
                    </div>
                </div>

                <div className="container contact-body">
                    <div className="contact-layout">
                        {/* Form */}
                        <div className="contact-form-wrap glass-card">
                            <h3 className="contact-form-title">Send Us a Message</h3>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="checkout-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Your Name *</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="form-input"
                                            required
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="form-input"
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="form-input"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message *</label>
                                    <textarea
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="form-input contact-textarea"
                                        required
                                        placeholder="Tell us about your query, order issue, or feedback..."
                                        rows={6}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                    {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FiSend /> Send Message</>}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <h3 className="contact-info__title">Contact Information</h3>
                            <p className="contact-info__desc">
                                Reach out to our dedicated customer care team through any of the channels below.
                            </p>
                            {contactInfo.map(({ Icon, label, value, href }) => (
                                <a key={label} href={href} className="contact-info__item glass-card">
                                    <div className="contact-info__icon"><Icon /></div>
                                    <div>
                                        <p className="contact-info__label">{label}</p>
                                        <p className="contact-info__value">{value}</p>
                                    </div>
                                </a>
                            ))}
                            <div className="contact-hours glass-card">
                                <h4 className="contact-info__label" style={{ marginBottom: 12 }}>Business Hours</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                                    Monday – Friday: 9:00 AM – 6:00 PM<br />
                                    Saturday: 10:00 AM – 4:00 PM<br />
                                    <span style={{ color: 'var(--text-muted)' }}>Sunday: Closed</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ContactPage;
