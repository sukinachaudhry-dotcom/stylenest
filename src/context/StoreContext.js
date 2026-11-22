'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackAddToWishlist,
  trackApplyCoupon,
} from '@/utils/trackingHandlers';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('stylenest_cart');
      const savedWishlist = localStorage.getItem('stylenest_wishlist');
      const savedCoupon = localStorage.getItem('stylenest_coupon');
      const savedOrder = localStorage.getItem('stylenest_last_order');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
      if (savedOrder) setLastOrder(JSON.parse(savedOrder));
    } catch (error) {
      console.error('Failed to load store from LocalStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('stylenest_cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // Persist wishlist
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('stylenest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  // Persist coupon
  useEffect(() => {
    if (isHydrated) {
      if (coupon) {
        localStorage.setItem('stylenest_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('stylenest_coupon');
      }
    }
  }, [coupon, isHydrated]);

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];
    const cartKey = `${product.id}-${size}-${color}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartKey === cartKey);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          cartKey,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          color,
          quantity,
        },
      ];
    });

    trackAddToCart(product, quantity, size, color);
  };

  const updateCartQuantity = (cartKey, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartKey) => {
    const itemToRemove = cart.find((item) => item.cartKey === cartKey);
    if (itemToRemove) {
      trackRemoveFromCart(itemToRemove);
    }
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    localStorage.removeItem('stylenest_cart');
    localStorage.removeItem('stylenest_coupon');
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setWishlist((prev) => [...prev, product]);
      trackAddToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const moveWishlistToCart = (product) => {
    addToCart(product, 1, product.sizes[0], product.colors[0]);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? subtotal * coupon.discountRate : 0;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCouponCode = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'SAVE10') {
      const discountRate = 0.1;
      const calcDiscount = subtotal * discountRate;
      setCoupon({ code: 'SAVE10', discountRate });
      trackApplyCoupon('SAVE10', calcDiscount, true);
      return { success: true, message: 'Coupon SAVE10 applied! 10% off your subtotal.' };
    }
    trackApplyCoupon(normalized, 0, false);
    return { success: false, message: 'Invalid coupon code. Try SAVE10.' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const saveCompletedOrder = (orderData) => {
    setLastOrder(orderData);
    localStorage.setItem('stylenest_last_order', JSON.stringify(orderData));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        lastOrder,
        isHydrated,
        cartCount,
        subtotal,
        discount,
        shipping,
        total,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        applyCouponCode,
        removeCoupon,
        saveCompletedOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}