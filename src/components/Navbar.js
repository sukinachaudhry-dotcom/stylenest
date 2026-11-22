'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlist, isHydrated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop All' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          Style<span>Nest</span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href="/wishlist" className="icon-btn" aria-label="Wishlist">
            <span>Wishlist</span>
            {isHydrated && wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </Link>

          <Link href="/cart" className="icon-btn" aria-label="Shopping Cart">
            <span>Cart</span>
            {isHydrated && cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </Link>

          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}