'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, isHydrated } = useStore();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const wishlisted = isHydrated ? isInWishlist(product.id) : false;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1, product.sizes[0], product.colors[0]);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          className={`wishlist-float-btn ${wishlisted ? 'active' : ''}`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
        {product.bestseller && <span className="product-tag">Bestseller</span>}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link href={`/products/${product.id}`} className="product-title">
          {product.name}
        </Link>
        <div className="product-bottom">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn btn-sm btn-primary"
          >
            {addedFeedback ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}