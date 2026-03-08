import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// Lazy-load pages for code splitting
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Full-page loader
const PageLoader = () => (
    <div className="page-loader">
        <div className="splash__logo-letters" style={{ fontSize: '2.5rem' }}>VERTEX</div>
        <div className="spinner" style={{ marginTop: 20 }} />
    </div>
);

// Protected route – redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading) return <PageLoader />;
    return user ? children : <Navigate to="/login" replace />;
};

// Admin-only route
const AdminRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading) return <PageLoader />;
    return user && user.role === 'admin' ? children : <Navigate to="/home" replace />;
};

// Public-only route – redirects logged-in users to /home
const PublicRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading) return <PageLoader />;
    return !user ? children : <Navigate to="/home" replace />;
};

const AppRoutes = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Splash / index */}
            <Route path="/" element={<SplashScreen />} />

            {/* Public-only auth routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

            {/* Public content routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/shampoo" element={<ProductsPage />} />
            <Route path="/products/conditioner" element={<ProductsPage />} />
            <Route path="/products/mask" element={<ProductsPage />} />
            <Route path="/products/serum" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected routes */}
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/order-success/:id" element={<PrivateRoute><OrderSuccessPage /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </Suspense>
);

const App = () => (
    <HelmetProvider>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <AppRoutes />
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: '#1a1a1a',
                                color: '#f5f5f5',
                                border: '1px solid rgba(212,175,55,0.25)',
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.9rem',
                            },
                            success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
                            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </HelmetProvider>
);

export default App;
