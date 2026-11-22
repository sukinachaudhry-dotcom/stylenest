'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function OrderSuccessPage() {
  const { lastOrder, isHydrated } = useStore();

  if (!isHydrated) {
    return <div className="container section">Loading order confirmation...</div>;
  }

  if (!lastOrder) {
    return (
      <div className="container section empty-state">
        <h2>No Recent Order Found</h2>
        <p>Start exploring our collections to place an order.</p>
        <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="success-subtitle">
          Your order has been confirmed and is being prepared for shipment.
        </p>

        <div className="order-meta-box">
          <div>
            <span>Order ID</span>
            <strong>{lastOrder.orderId}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{lastOrder.date}</strong>
          </div>
          <div>
            <span>Payment Method</span>
            <strong>{lastOrder.customer.paymentMethod}</strong>
          </div>
          <div>
            <span>Total Paid</span>
            <strong>${lastOrder.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="receipt-items">
          <h3>Purchased Items</h3>
          {lastOrder.items.map((item) => (
            <div key={item.cartKey} className="receipt-row">
              <div>
                <strong>{item.name}</strong>
                <span> ({item.size}, {item.color}) × {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="shipping-note">
          <p>
            Shipping to: <strong>{lastOrder.customer.fullName}</strong>, {lastOrder.customer.address}, {lastOrder.customer.city} {lastOrder.customer.postalCode}
          </p>
        </div>

        <Link href="/products" className="btn btn-primary btn-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}