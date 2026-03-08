import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WishlistPage = () => {
    const { wishlist, cart } = useCart();
    // We need to fetch full product details for wishlist items if wishlist store only IDs
    // For now, let's assume CartContext or a separate hook handles full product entities
    // Simple implementation using filtering from existing products state if available, 
    // or a placeholder if the product list isn't globally available yet.

    return (
        <>
            <Helmet>
                <title>My Wishlist | Vertex Hair Care</title>
            </Helmet>
            <Navbar />
            <main style={{ paddingTop: 120, paddingBottom: 80 }}>
                <div className="container">
                    <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 40 }}>My <span className="text-gold">Wishlist</span></h1>

                    {wishlist.length === 0 ? (
                        <div className="cart-empty glass-card" style={{ padding: 60, textAlign: 'center' }}>
                            <FiHeart size={60} style={{ color: 'var(--gold)', opacity: 0.3, marginBottom: 20 }} />
                            <h2>Your wishlist is empty</h2>
                            <p>Save your favorite luxury items to view them later.</p>
                            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Continue Shopping</Link>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {/* Note: This assumes CartContext provides product details. 
                   In a real app, you'd fetch /api/auth/me or a /wishlist endpoint to get full objects. */}
                            <p className="text-muted">You have {wishlist.length} item(s) in your wishlist.</p>
                            <div style={{ marginTop: 20, textAlign: 'center', padding: '40px', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                                <p>Wishlist items will appear here after they are populated from the database.</p>
                                <Link to="/products" className="text-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                                    Explore Products <FiChevronRight />
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

export default WishlistPage;
