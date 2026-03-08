import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) { setCart([]); return; }
        setCartLoading(true);
        try {
            const { data } = await api.get('/cart');
            setCart(data.cart || []);
        } catch (err) {
            console.error('Cart fetch error:', err);
        } finally {
            setCartLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchCart(); }, [fetchCart]);
    useEffect(() => {
        if (user?.wishlist) setWishlist(user.wishlist.map((p) => p._id || p));
    }, [user]);

    const addToCart = useCallback(async (productId, quantity = 1) => {
        try {
            await api.post('/cart', { productId, quantity });
            toast.success('Added to cart');
            fetchCart();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    }, [fetchCart]);

    const updateCartItem = useCallback(async (productId, quantity) => {
        try {
            await api.put(`/cart/${productId}`, { quantity });
            fetchCart();
        } catch (err) {
            toast.error('Failed to update cart');
        }
    }, [fetchCart]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            await api.delete(`/cart/${productId}`);
            toast.success('Item removed');
            fetchCart();
        } catch {
            toast.error('Failed to remove item');
        }
    }, [fetchCart]);

    const clearCart = useCallback(async () => {
        try {
            await api.delete('/cart');
            setCart([]);
        } catch {
            toast.error('Failed to clear cart');
        }
    }, []);

    const toggleWishlist = useCallback(async (productId) => {
        if (!user) { toast.error('Please login to use wishlist'); return; }
        try {
            const { data } = await api.post(`/cart/wishlist/${productId}`);
            if (data.inWishlist) {
                setWishlist((prev) => [...prev, productId]);
                toast.success('Added to wishlist');
            } else {
                setWishlist((prev) => prev.filter((id) => id !== productId));
                toast.success('Removed from wishlist');
            }
        } catch {
            toast.error('Failed to update wishlist');
        }
    }, [user]);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, wishlist, cartLoading, cartCount, subtotal,
            addToCart, updateCartItem, removeFromCart, clearCart, toggleWishlist, fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
