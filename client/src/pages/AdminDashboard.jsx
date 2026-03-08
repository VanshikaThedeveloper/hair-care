import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiGrid, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, orderRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders')
                ]);
                setProducts(prodRes.data.products);
                setOrders(orderRes.data.orders);
            } catch (err) {
                console.error('Admin fetch error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(0)}`, icon: FiDollarSign, color: '#22c55e' },
        { label: 'Orders', value: orders.length, icon: FiShoppingBag, color: 'var(--gold)' },
        { label: 'Products', value: products.length, icon: FiGrid, color: '#3b82f6' },
        { label: 'Customers', value: [...new Set(orders.map(o => o.user?._id))].length, icon: FiUsers, color: '#a855f7' },
    ];

    return (
        <>
            <Helmet>
                <title>Admin Dashboard | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main className="admin-page">
                <div className="container" style={{ paddingTop: 120, paddingBottom: 80 }}>
                    <div className="admin-header">
                        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 8 }}>Admin <span className="text-gold">Dashboard</span></h1>
                        <p className="text-muted">Manage your luxury hair care empire</p>
                    </div>

                    <div className="admin-stats">
                        {stats.map((s, i) => (
                            <div key={i} className="admin-stat-card glass-card">
                                <div className="admin-stat-icon" style={{ backgroundColor: `${s.color}20`, color: s.color }}><s.icon /></div>
                                <div>
                                    <p className="admin-stat-label">{s.label}</p>
                                    <p className="admin-stat-value">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-tabs">
                        <button className={`admin-tab ${activeTab === 'products' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
                        <button className={`admin-tab ${activeTab === 'orders' ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab('orders')}>Recent Orders</button>
                    </div>

                    <div className="admin-content glass-card">
                        {loading ? (
                            <div className="skeleton" style={{ height: 400 }} />
                        ) : activeTab === 'products' ? (
                            <div className="admin-table-wrap">
                                <div className="admin-table-header">
                                    <h3>Products Inventory</h3>
                                    <button className="btn btn-primary btn-sm"><FiPlus /> Add Product</button>
                                </div>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p._id}>
                                                <td><img src={p.images?.[0]?.url || p.images?.[0]} alt="" className="admin-table-img" /></td>
                                                <td>{p.name}</td>
                                                <td>{p.category}</td>
                                                <td>₹{p.price}</td>
                                                <td>{p.stock}</td>
                                                <td>
                                                    <div className="admin-actions">
                                                        <button className="admin-action-btn"><FiEdit /></button>
                                                        <button className="admin-action-btn admin-action-btn--danger"><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="admin-table-wrap">
                                <h3>Customer Orders</h3>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o._id}>
                                                <td className="text-gold">#{o._id.slice(-6).toUpperCase()}</td>
                                                <td>{o.user?.name || 'Guest'}</td>
                                                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                <td>₹{o.totalPrice}</td>
                                                <td><span className={`badge ${o.orderStatus === 'Delivered' ? 'badge-success' : 'badge-gold'}`}>{o.orderStatus}</span></td>
                                                <td><button className="btn btn-outline btn-sm">View</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AdminDashboard;
