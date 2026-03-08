import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiPackage, FiTruck, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my-orders');
                setOrders(data.orders);
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <FiCheckCircle style={{ color: '#22c55e' }} />;
            case 'Shipped': return <FiTruck style={{ color: 'var(--gold)' }} />;
            default: return <FiPackage style={{ color: 'var(--text-muted)' }} />;
        }
    };

    return (
        <>
            <Helmet>
                <title>My Orders | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main className="orders-page">
                <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
                    <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 40 }}>My <span className="text-gold">Orders</span></h1>

                    {loading ? (
                        <div className="orders-grid">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 16 }} />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="cart-empty glass-card" style={{ padding: 60 }}>
                            <FiPackage size={60} style={{ color: 'var(--gold)', opacity: 0.3, marginBottom: 20 }} />
                            <h2>No orders found</h2>
                            <p>You haven't placed any orders yet. Start your luxury journey today.</p>
                            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Explore Collection</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card glass-card">
                                    <div className="order-card__header">
                                        <div>
                                            <p className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className="order-card__status">
                                            {getStatusIcon(order.orderStatus)}
                                            <span>{order.orderStatus}</span>
                                        </div>
                                    </div>
                                    <div className="order-card__body">
                                        <div className="order-card__items-preview">
                                            {order.orderItems.map((item, i) => (
                                                <div key={i} className="order-card__item">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-card__info">
                                            <p className="order-card__total">Total: <span className="text-gold">₹{order.totalPrice.toFixed(2)}</span></p>
                                            <p className="order-card__payment">Payment: {order.paymentInfo?.status === 'succeeded' ? 'Paid' : 'Pending'}</p>
                                        </div>
                                        <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                                            Details <FiChevronRight />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default OrdersPage;
