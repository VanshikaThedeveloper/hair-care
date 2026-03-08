import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { couponCode = '', discount = 0 } = location.state || {};

    const GST_RATE = 0.18;
    const FREE_SHIPPING_THRESHOLD = 999;
    const afterDiscount = Math.max(0, subtotal - discount);
    const gst = Math.round(afterDiscount * GST_RATE * 100) / 100;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
    const total = afterDiscount + gst + shipping;

    const [form, setForm] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: 'India',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) { toast.error('Your cart is empty'); return; }

        setLoading(true);
        try {
            const orderItems = cart.map(({ product, quantity }) => ({
                product: product._id,
                name: product.name,
                image: product.images?.[0]?.url || '',
                price: product.price,
                quantity,
            }));

            const { data } = await api.post('/orders', {
                orderItems,
                shippingAddress: form,
                paymentMethod,
                couponCode,
            });

            if (paymentMethod === 'razorpay') {
                // [REPLACE] Integrate Razorpay SDK here
                // const options = { key: import.meta.env.VITE_RAZORPAY_KEY_ID, amount: total*100, ... }
                toast.success('Razorpay integration ready – replace with actual SDK initialization');
            }

            toast.success('Order placed successfully! 🎉');
            clearCart();
            navigate(`/order-success/${data.order._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Checkout | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main className="checkout-page">
                <div className="checkout-page__header">
                    <div className="container">
                        <h1 className="section-title">Secure <span className="text-gold">Checkout</span></h1>
                    </div>
                </div>

                <div className="container checkout-page__body">
                    <form onSubmit={handleOrder} className="checkout-layout">
                        {/* Shipping Form */}
                        <div className="checkout-form">
                            <h3 className="checkout-section-title">Shipping Information</h3>
                            <div className="checkout-grid-2">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input name="fullName" value={form.fullName} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone *</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} className="form-input" required type="tel" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Street Address *</label>
                                <input name="street" value={form.street} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="checkout-grid-3">
                                <div className="form-group">
                                    <label className="form-label">City *</label>
                                    <input name="city" value={form.city} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State *</label>
                                    <input name="state" value={form.state} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pincode *</label>
                                    <input name="pincode" value={form.pincode} onChange={handleChange} className="form-input" required maxLength={6} />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <h3 className="checkout-section-title" style={{ marginTop: 32 }}>Payment Method</h3>
                            <div className="payment-methods">
                                {[
                                    { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                                    { value: 'razorpay', label: 'Razorpay (UPI / Card / Net Banking)', icon: '💳' },
                                    { value: 'upi', label: 'UPI Direct', icon: '📱' },
                                ].map((m) => (
                                    <label key={m.value} className={`payment-method ${paymentMethod === m.value ? 'payment-method--active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={m.value}
                                            checked={paymentMethod === m.value}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="payment-method__icon">{m.icon}</span>
                                        <span>{m.label}</span>
                                        {m.value === 'razorpay' && (
                                            <span className="payment-note">
                                                {/* [REPLACE] Add VITE_RAZORPAY_KEY_ID to client .env */}
                                                Integration ready
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary glass-card">
                            <h3 className="cart-summary__title">Order Summary</h3>
                            <div className="checkout-items">
                                {cart.map(({ product, quantity }) => (
                                    <div key={product?._id} className="checkout-item">
                                        <img src={product?.images?.[0]?.url} alt={product?.name} />
                                        <div>
                                            <p className="checkout-item__name">{product?.name}</p>
                                            <p className="checkout-item__qty">Qty: {quantity}</p>
                                        </div>
                                        <span>₹{(product?.price * quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary__rows">
                                <div className="cart-summary__row">
                                    <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && <div className="cart-summary__row cart-summary__row--discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                                <div className="cart-summary__row"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span><span>{shipping === 0 ? <span className="text-gold">FREE</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="cart-summary__divider" />
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span><span className="text-gold">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} disabled={loading}>
                                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : `Place Order – ₹${total.toFixed(2)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CheckoutPage;
