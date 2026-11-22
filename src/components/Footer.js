import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">StyleNest</h3>
          <p className="footer-desc">
            Contemporary essentials crafted with enduring materials and modern silhouettes.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link href="/products">All Products</Link></li>
            <li><Link href="/products?category=Outerwear">Outerwear</Link></li>
            <li><Link href="/products?category=Dresses">Dresses</Link></li>
            <li><Link href="/products?category=Accessories">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4>Customer Care</h4>
          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/cart">Shopping Cart</Link></li>
            <li><Link href="/wishlist">Saved Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4>Promo Code</h4>
          <p className="footer-desc">
            Use code <strong>SAVE10</strong> at checkout for 10% off your entire order.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} StyleNest Apparel. All rights reserved.</p>
      </div>
    </footer>
  );
}