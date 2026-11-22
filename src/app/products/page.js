// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import { products } from '@/data/products';
// import { useStore } from '@/context/StoreContext';
// import ProductCard from '@/components/ProductCard';
// import { trackViewContent } from '@/utils/trackingHandlers';

// export default function ProductDetailsPage() {
//   const params = useParams();
//   const product = products.find((p) => p.id === params.id);

//   const { addToCart, toggleWishlist, isInWishlist, isHydrated } = useStore();
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [addedMessage, setAddedMessage] = useState(false);

//   useEffect(() => {
//     if (product) {
//       setSelectedSize(product.sizes[0]);
//       setSelectedColor(product.colors[0]);
//       setQuantity(1);
//       trackViewContent(product);
//     }
//   }, [product]);

//   if (!product) {
//     return (
//       <div className="container section empty-state">
//         <h2>Product Not Found</h2>
//         <p>The item you are looking for may have been moved or sold out.</p>
//         <Link href="/products" className="btn btn-primary">Back to Shop</Link>
//       </div>
//     );
//   }

//   const wishlisted = isHydrated ? isInWishlist(product.id) : false;
//   const relatedProducts = products
//     .filter((p) => p.category === product.category && p.id !== product.id)
//     .slice(0, 4);

//   const handleAddToCart = () => {
//     addToCart(product, quantity, selectedSize, selectedColor);
//     setAddedMessage(true);
//     setTimeout(() => setAddedMessage(false), 1800);
//   };

//   return (
//     <div className="container section">
//       <div className="breadcrumb">
//         <Link href="/">Home</Link> / <Link href="/products">Shop</Link> / <span>{product.name}</span>
//       </div>

//       <div className="pdp-grid">
//         <div className="pdp-image">
//           <img src={product.image} alt={product.name} />
//         </div>

//         <div className="pdp-details">
//           <span className="product-category">{product.category}</span>
//           <h1>{product.name}</h1>
//           <p className="pdp-price">${product.price.toFixed(2)}</p>
//           <p className="pdp-desc">{product.description}</p>

//           {/* Color Selector */}
//           <div className="option-group">
//             <label>Color: <strong>{selectedColor}</strong></label>
//             <div className="option-buttons">
//               {product.colors.map((color) => (
//                 <button
//                   key={color}
//                   type="button"
//                   onClick={() => setSelectedColor(color)}
//                   className={`option-btn ${selectedColor === color ? 'active' : ''}`}
//                 >
//                   {color}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Size Selector */}
//           <div className="option-group">
//             <label>Size: <strong>{selectedSize}</strong></label>
//             <div className="option-buttons">
//               {product.sizes.map((size) => (
//                 <button
//                   key={size}
//                   type="button"
//                   onClick={() => setSelectedSize(size)}
//                   className={`option-btn ${selectedSize === size ? 'active' : ''}`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quantity Selector */}
//           <div className="option-group">
//             <label>Quantity</label>
//             <div className="qty-control">
//               <button
//                 type="button"
//                 onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                 aria-label="Decrease quantity"
//               >
//                 -
//               </button>
//               <span>{quantity}</span>
//               <button
//                 type="button"
//                 onClick={() => setQuantity((q) => q + 1)}
//                 aria-label="Increase quantity"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="pdp-actions">
//             <button type="button" onClick={handleAddToCart} className="btn btn-primary btn-lg">
//               {addedMessage ? 'Added to Cart ✓' : 'Add to Cart'}
//             </button>
//             <button
//               type="button"
//               onClick={() => toggleWishlist(product)}
//               className={`btn btn-outline btn-lg ${wishlisted ? 'wishlisted' : ''}`}
//             >
//               {wishlisted ? '♥ Saved in Wishlist' : '♡ Add to Wishlist'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <section className="section">
//           <div className="section-header">
//             <h2>You May Also Like</h2>
//           </div>
//           <div className="product-grid">
//             {relatedProducts.map((item) => (
//               <ProductCard key={item.id} product={item} />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { trackSearch, trackApplyFilter } from '@/utils/trackingHandlers';

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(250);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat && categories.includes(paramCat)) {
      setSelectedCategory(paramCat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim(), filteredProducts.length);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    trackApplyFilter({ filterType: 'category', value: category, maxPrice, sortBy });
  };

  const handlePriceChange = (value) => {
    const numVal = Number(value);
    setMaxPrice(numVal);
    trackApplyFilter({ filterType: 'maxPrice', value: numVal, category: selectedCategory, sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    trackApplyFilter({ filterType: 'sort', value, category: selectedCategory, maxPrice });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(250);
    setSortBy('default');
    trackApplyFilter({ filterType: 'reset' });
  };

  return (
    <div className="container section">
      <div className="catalog-header">
        <h1>All Collections</h1>
        <p>Showing {filteredProducts.length} of {products.length} items</p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="toolbar">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="filter-controls">
          <div className="price-filter">
            <label htmlFor="priceRange">Max Price: <strong>${maxPrice}</strong></label>
            <input
              id="priceRange"
              type="range"
              min="40"
              max="250"
              step="5"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="select-input"
            aria-label="Sort products"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical: A–Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching products found</h3>
          <p>Try adjusting your search keywords, category, or maximum price filter.</p>
          <button type="button" onClick={resetFilters} className="btn btn-primary">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section">Loading catalog...</div>}>
      <ProductsCatalog />
    </Suspense>
  );
}