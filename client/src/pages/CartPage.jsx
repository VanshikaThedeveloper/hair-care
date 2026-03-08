import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiMinus, FiPlus, FiTag, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import './CartPage.css';

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

const CartPage = () => {
    const { cart, cartLoading, updateCartItem, removeFromCart, clearCart, subtotal } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);

    const discount = couponData?.discountAmount || 0;
    const afterDiscount = Math.max(0, subtotal - discount);
    const gst = Math.round(afterDiscount * GST_RATE * 100) / 100;
    const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : cart.length > 0 ? SHIPPING_CHARGE : 0;
    const total = afterDiscount + gst + shipping;

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const { data } = await api.post('/coupons/validate', { code: couponCode, cartTotal: subtotal });
            setCouponData(data);
            toast.success(`Coupon applied! You save ₹${data.discountAmount}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid coupon code');
            setCouponData(null);
        } finally {
            setCouponLoading(false);
        }
    };

    if (cartLoading) return (
        <>
            <Navbar />
            <div className="page-loader" style={{ minHeight: '100vh' }}><div className="spinner" /></div>
            <Footer />
        </>
    );

    return (
        <>
            <Helmet>
                <title>Your Cart | Vertex Hair Care</title>
                <meta name="description" content="Review items in your Vertex Hair Care cart and proceed to checkout." />
            </Helmet>
            <Navbar />
            <main className="cart-page">
                <div className="cart-page__header">
                    <div className="container">
                        <h1 className="section-title">Your <span className="text-gold">Cart</span></h1>
                    </div>
                </div>

                <div className="container cart-page__body">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty__icon">🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Explore our premium collection and add some luxury to your routine.</p>
                            <Link to="/products" className="btn btn-primary">Shop Now</Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            {/* Cart items */}
                            <div className="cart-items">
                                <div className="cart-items__header">
                                    <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
                                    <button onClick={clearCart} className="cart-clear-btn">Clear All</button>
                                </div>

                                {cart.map(({ product, quantity, _id }) => (
                                    <div key={_id} className="cart-item glass-card">
                                        <img src={product?.images?.[0]?.url} alt={product?.name} className="cart-item__image" />
                                        <div className="cart-item__info">
                                            <p className="cart-item__category">{product?.category?.replace('-', ' ')}</p>
                                            <Link to={`/products/${product?._id}`} className="cart-item__name">{product?.name}</Link>
                                            <span className="cart-item__price">₹{product?.price}</span>
                                        </div>
                                        <div className="cart-item__controls">
                                            <div className="quantity-control">
                                                <button onClick={() => updateCartItem(product?._id, quantity - 1)}><FiMinus /></button>
                                                <span>{quantity}</span>
                                                <button onClick={() => updateCartItem(product?._id, quantity + 1)}><FiPlus /></button>
                                            </div>
                                            <span className="cart-item__subtotal">₹{(product?.price * quantity).toFixed(2)}</span>
                                            <button className="cart-item__remove" onClick={() => removeFromCart(product?._id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary */}
                            <div className="cart-summary glass-card">
                                <h3 className="cart-summary__title">Order Summary</h3>

                                {/* Coupon */}
                                <div className="cart-coupon">
                                    <div className="cart-coupon__input-wrap">
                                        <FiTag className="cart-coupon__icon" />
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="form-input"
                                            style={{ paddingLeft: 36 }}
                                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                                        />
                                    </div>
                                    <button className="btn btn-outline btn-sm" onClick={applyCoupon} disabled={couponLoading}>
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {couponData && (
                                    <p className="cart-coupon__success">
                                        ✓ "{couponData.coupon.code}" applied – Save ₹{couponData.discountAmount}
                                    </p>
                                )}

                                {/* Price breakdown */}
                                <div className="cart-summary__rows">
                                    <div className="cart-summary__row">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="cart-summary__row cart-summary__row--discount">
                                            <span>Discount</span>
                                            <span>-₹{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="cart-summary__row">
                                        <span>GST (18%)</span>
                                        <span>₹{gst.toFixed(2)}</span>
                                    </div>
                                    <div className="cart-summary__row">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? <span className="text-gold">FREE</span> : `₹${shipping}`}</span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="cart-shipping-notice">
                                            Add ₹{(FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(0)} more for free shipping!
                                        </p>
                                    )}
                                    <div className="cart-summary__divider" />
                                    <div className="cart-summary__row cart-summary__row--total">
                                        <span>Total</span>
                                        <span className="text-gold">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => navigate('/checkout', { state: { couponCode: couponData?.coupon?.code, discount } })}
                                >
                                    Proceed to Checkout <FiChevronRight />
                                </button>

                                <Link to="/products" className="cart-continue-link">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CartPage;
