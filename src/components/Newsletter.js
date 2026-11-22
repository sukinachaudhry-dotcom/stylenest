'use client';

import { useState } from 'react';
import { trackNewsletterSubscribe } from '@/utils/trackingHandlers';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    trackNewsletterSubscribe(email.trim());
    setStatus({
      type: 'success',
      message: 'Welcome to StyleNest! Check your inbox for 10% off (Code: SAVE10).',
    });
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <div className="container newsletter-box">
        <div className="newsletter-text">
          <h2>Join the StyleNest Insider List</h2>
          <p>
            Receive early access to seasonal drops, private sales, and 10% off your first order.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="newsletter-form" noValidate>
          <div className="newsletter-input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </div>
          {status.message && (
            <p className={`form-feedback ${status.type}`}>{status.message}</p>
          )}
        </form>
      </div>
    </section>
  );
}