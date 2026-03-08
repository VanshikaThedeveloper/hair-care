import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { gsap } from 'gsap';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/home', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/about', label: 'About' },
        { to: '/reviews', label: 'Reviews' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__container container">
                {/* Logo */}
                <Link to="/home" className="navbar__logo">
                    {/* [REPLACE] with actual logo image */}
                    <span className="navbar__logo-text">VERTEX</span>
                    <span className="navbar__logo-sub">HAIR CARE</span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className="navbar__links">
                    {navLinks.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                    {isAdmin && (
                        <li>
                            <Link
                                to="/admin"
                                className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin') ? 'navbar__link--active' : ''}`}
                            >
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Right Actions */}
                <div className="navbar__actions">
                    <button className="navbar__icon-btn" onClick={() => setSearchOpen((p) => !p)} aria-label="Search">
                        <FiSearch />
                    </button>

                    {user && (
                        <Link to="/cart" className="navbar__icon-btn navbar__cart" aria-label="Cart">
                            <FiShoppingCart />
                            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
                        </Link>
                    )}

                    {user ? (
                        <div className="navbar__user-menu">
                            <button className="navbar__icon-btn navbar__user-btn" aria-label="User menu">
                                <FiUser />
                                <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
                            </button>
                            <div className="navbar__dropdown">
                                <Link to="/profile" className="navbar__dropdown-item">My Profile</Link>
                                <Link to="/orders" className="navbar__dropdown-item">My Orders</Link>
                                <Link to="/wishlist" className="navbar__dropdown-item">Wishlist</Link>
                                <button onClick={logout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="navbar__hamburger"
                        onClick={() => setIsOpen((p) => !p)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {searchOpen && (
                <div className="navbar__search">
                    <form onSubmit={handleSearch} className="navbar__search-form container">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navbar__search-input"
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar__mobile-menu">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to} className="navbar__mobile-link">{label}</Link>
                    ))}
                    {isAdmin && <Link to="/admin" className="navbar__mobile-link">Admin Dashboard</Link>}
                    {user ? (
                        <>
                            <Link to="/cart" className="navbar__mobile-link">Cart ({cartCount})</Link>
                            <Link to="/profile" className="navbar__mobile-link">My Profile</Link>
                            <Link to="/orders" className="navbar__mobile-link">My Orders</Link>
                            <button onClick={logout} className="navbar__mobile-link navbar__mobile-link--danger">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ margin: '16px' }}>Login / Signup</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
