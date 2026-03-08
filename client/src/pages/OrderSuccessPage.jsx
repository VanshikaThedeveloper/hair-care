import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const { id } = useParams();
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart locally if state wasn't cleared by API
        clearCart();
    }, [clearCart]);

    return (
        <>
            <Helmet>
                <title>Order Success | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main className="success-page">
                <div className="container success-container">
                    <div className="success-card glass-card">
                        <div className="success-icon-wrap">
                            <FiCheckCircle className="success-icon" />
                        </div>
                        <h1 className="success-title">Order Placed Successfully!</h1>
                        <p className="success-text">
                            Thank you for choosing Vertex. Your order <span className="text-gold">#{id?.slice(-8).toUpperCase()}</span> has been confirmed and is being prepared for shipment.
                        </p>
                        <div className="success-info glass-card">
                            <div className="success-info__item">
                                <FiPackage className="text-gold" />
                                <span>Estimated Delivery: 3-5 Business Days</span>
                            </div>
                        </div>
                        <div className="success-actions">
                            <Link to="/home" className="btn btn-outline">Back to Home</Link>
                            <Link to="/orders" className="btn btn-primary">
                                View My Orders <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default OrderSuccessPage;
