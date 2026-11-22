'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill out your name, email, and message.');
      return;
    }
    setError('');
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const whatsappNumber = '15550192834';
  const whatsappText = encodeURIComponent('Hi StyleNest Support, I have a question about an item.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="container section">
      <div className="contact-grid">
        <div>
          <h1>Get in Touch</h1>
          <p className="contact-lead">
            Have a question about sizing, shipping, or styling advice? Our team responds within 24 hours.
          </p>

          <div className="contact-info-box">
            <p><strong>Email:</strong> support@stylenest-demo.com</p>
            <p><strong>Showroom Hours:</strong> Mon – Fri, 9:00 AM – 6:00 PM EST</p>
            <p><strong>Location:</strong> 450 Mercer St, New York, NY 10013</p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn whatsapp-btn"
          >
            Chat with Us on WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="contact-form-card">
          <h3>Send a Message</h3>

          {submitted && (
            <div className="alert-success">
              Thank you! Your message has been sent. Our concierge team will reach out shortly.
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alex Morgan"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@example.com"
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Order inquiry or sizing question"
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you?"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}