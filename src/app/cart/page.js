'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { trackInitiateCheckout } from '@/utils/trackingHandlers';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    coupon,
    subtotal,
    discount,
    shipping,
    total,
    updateCartQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
    isHydrated,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ type: '', message: '' });

  if (!isHydrated) {
    return <div className="container section">Loading cart...</div>;
  }

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCouponCode(couponInput);
    setCouponFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
    if (result.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    trackInitiateCheckout(cart, total);
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container section empty-state">
        <h2>Your Shopping Cart is Empty</h2>
        <p>Looks like you haven&apos;t added any pieces to your cart yet.</p>
        <Link href="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.cartKey} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <Link href={`/products/${item.id}`} className="cart-item-title">
                  {item.name}
                </Link>
                <p className="cart-item-meta">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.cartKey)}
                  className="remove-link"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Coupon */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>

          {/* Coupon Form */}
          <form onSubmit={handleCouponSubmit} className="coupon-form">
            <input
              type="text"
              placeholder="Coupon code (try SAVE10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button type="submit" className="btn btn-outline">Apply</button>
          </form>

          {couponFeedback.message && (
            <p className={`form-feedback ${couponFeedback.type}`}>{couponFeedback.message}</p>
          )}

          {coupon && (
            <div className="active-coupon">
              <span>Applied: <strong>{coupon.code}</strong> (-10%)</span>
              <button type="button" onClick={removeCoupon} className="remove-link">Remove</button>
            </div>
          )}

          <div className="summary-lines">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount ({coupon.code})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="btn btn-primary btn-block btn-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}