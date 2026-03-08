import { Link } from 'react-router-dom';
// [REPLACE] Social media links below
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = {
        'Shop': [
            { label: 'Shampoo', to: '/products?category=shampoo' },
            { label: 'Conditioner', to: '/products?category=conditioner' },
            { label: 'Hair Mask', to: '/products?category=hair-mask' },
            { label: 'Serum', to: '/products?category=serum' },
            { label: 'Hair Oil', to: '/products?category=hair-oil' },
        ],
        'Company': [
            { label: 'About Us', to: '/about' },
            { label: 'Reviews', to: '/reviews' },
            { label: 'Contact', to: '/contact' },
            { label: 'Blog', to: '#' },
        ],
        'Support': [
            { label: 'My Orders', to: '/orders' },
            { label: 'FAQs', to: '#' },
            { label: 'Shipping Policy', to: '#' },
            { label: 'Return Policy', to: '#' },
        ],
    };

    const socials = [
        // [REPLACE] with your actual social media URLs
        { Icon: FiInstagram, href: '#', label: 'Instagram' },
        { Icon: FiTwitter, href: '#', label: 'Twitter' },
        { Icon: FiYoutube, href: '#', label: 'YouTube' },
        { Icon: FiFacebook, href: '#', label: 'Facebook' },
    ];

    return (
        <footer className="footer">
            <div className="footer__top container">
                {/* Brand */}
                <div className="footer__brand">
                    <div className="footer__logo">
                        <span className="footer__logo-text">VERTEX</span>
                        <span className="footer__logo-sub">HAIR CARE</span>
                    </div>
                    <p className="footer__tagline">
                        The gold standard in luxury hair care. Crafted for those who demand excellence.
                    </p>
                    {/* Social Icons */}
                    <div className="footer__socials">
                        {socials.map(({ Icon, href, label }) => (
                            <a key={label} href={href} className="footer__social-link" aria-label={label} target="_blank" rel="noopener noreferrer">
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links */}
                {Object.entries(links).map(([category, items]) => (
                    <div key={category} className="footer__col">
                        <h4 className="footer__col-title">{category}</h4>
                        <ul className="footer__col-links">
                            {items.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="footer__link">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Newsletter */}
                <div className="footer__newsletter">
                    <h4 className="footer__col-title">Stay Exclusive</h4>
                    <p className="footer__newsletter-text">Get early access to launches, luxury tips & member-only offers.</p>
                    <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your email address" className="footer__newsletter-input" />
                        <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="footer__bottom container">
                <p className="footer__copyright">
                    © {currentYear} Vertex Private Company. All rights reserved.
                </p>
                <div className="footer__bottom-links">
                    {/* [REPLACE] Contact details below */}
                    <a href="mailto:support@vertex.com" className="footer__bottom-link">support@vertex.com</a>
                    <span>|</span>
                    <a href="tel:+91XXXXXXXXXX" className="footer__bottom-link">+91 XXXXXXXXXX</a>
                    <span>|</span>
                    <Link to="#" className="footer__bottom-link">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
