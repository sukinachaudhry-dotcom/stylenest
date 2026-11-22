'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { trackAddPaymentInfo, trackPurchase } from '@/utils/trackingHandlers';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discount,
    shipping,
    total,
    clearCart,
    saveCompletedOrder,
    isHydrated,
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Credit Card',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);

  if (!isHydrated) {
    return <div className="container section">Loading checkout...</div>;
  }

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="container section empty-state">
        <h2>Your cart is empty</h2>
        <p>Add items to your cart before proceeding to checkout.</p>
        <Link href="/products" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const handlePaymentSelect = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
    trackAddPaymentInfo(method, total);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Prevent duplicate order submission
    if (submissionLock.current || isSubmitting) return;
    if (!validateForm()) return;

    submissionLock.current = true;
    setIsSubmitting(true);

    const uniqueOrderId = `SN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const orderRecord = {
      orderId: uniqueOrderId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customer: { ...formData },
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
    };

    trackAddPaymentInfo(formData.paymentMethod, total);
    trackPurchase(orderRecord);

    saveCompletedOrder(orderRecord);
    clearCart();

    router.push('/order-success');
  };

  return (
    <div className="container section">
      <h1>Checkout</h1>

      <div className="cart-layout">
        <form onSubmit={handlePlaceOrder} className="checkout-form" noValidate>
          <h3>Customer & Shipping Details</h3>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Sukyna Chaudhry"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sukyna@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Shipping Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="72 Evergreen Terrace, Apt 4B"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>Postal / ZIP Code *</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="10001"
              />
              {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
            </div>
          </div>

          <h3>Payment Method</h3>
          <div className="payment-options">
            {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
              <label
                key={method}
                className={`payment-card ${formData.paymentMethod === method ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={() => handlePaymentSelect(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block btn-lg"
          >
            {isSubmitting ? 'Processing Order...' : `Place Order • $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="order-summary-card">
          <h3>Order Summary ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</h3>
          <div className="checkout-items-list">
            {cart.map((item) => (
              <div key={item.cartKey} className="checkout-mini-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.size} / {item.color} × {item.quantity}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-lines">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
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
        </div>
      </div>
    </div>
  );
}