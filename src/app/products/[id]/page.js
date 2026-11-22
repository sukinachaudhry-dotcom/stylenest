'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { products } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { trackViewContent } from '@/utils/trackingHandlers';

export default function ProductDetailsPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);

  const { addToCart, toggleWishlist, isInWishlist, isHydrated } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      trackViewContent(product);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container section empty-state">
        <h2>Product Not Found</h2>
        <p>The item you are looking for may have been moved or sold out.</p>
        <Link href="/products" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const wishlisted = isHydrated ? isInWishlist(product.id) : false;
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 1800);
  };

  return (
    <div className="container section">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/products">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className="pdp-grid">
        <div className="pdp-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="pdp-details">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="pdp-price">${product.price.toFixed(2)}</p>
          <p className="pdp-desc">{product.description}</p>

          {/* Color Selector */}
          <div className="option-group">
            <label>Color: <strong>{selectedColor}</strong></label>
            <div className="option-buttons">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="option-group">
            <label>Size: <strong>{selectedSize}</strong></label>
            <div className="option-buttons">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="option-group">
            <label>Quantity</label>
            <div className="qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pdp-actions">
            <button type="button" onClick={handleAddToCart} className="btn btn-primary btn-lg">
              {addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`btn btn-outline btn-lg ${wishlisted ? 'wishlisted' : ''}`}
            >
              {wishlisted ? '♥ Saved in Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>You May Also Like</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}