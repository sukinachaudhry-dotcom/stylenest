'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, moveWishlistToCart, isHydrated } = useStore();

  if (!isHydrated) {
    return <div className="container section">Loading wishlist...</div>;
  }

  return (
    <div className="container section">
      <div className="section-header">
        <h1>My Wishlist ({wishlist.length})</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite items while browsing to revisit or move them to your cart later.</p>
          <Link href="/products" className="btn btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrap">
                <Link href={`/products/${product.id}`}>
                  <img src={product.image} alt={product.name} className="product-image" />
                </Link>
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link href={`/products/${product.id}`} className="product-title">
                  {product.name}
                </Link>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="wishlist-card-actions">
                  <button
                    type="button"
                    onClick={() => moveWishlistToCart(product)}
                    className="btn btn-primary btn-sm"
                  >
                    Move to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="btn btn-outline btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}