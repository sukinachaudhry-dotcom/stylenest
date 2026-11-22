// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className={styles.intro}>
//           <h1>
//             To get started, edit the{" "}
//             <code className={styles.code}>page.js</code> file.
//           </h1>
//           <p>
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={14}
//             />
//             Deploy Now
//           </a>
//           <a
//             className={styles.secondary}
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

import Link from 'next/link';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestSellingProducts = products.filter((p) => p.bestseller).slice(0, 4);
  const displayCategories = categories.filter((c) => c !== 'All');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-eyebrow">Autumn / Winter Collection</span>
            <h1>Elevated Essentials for Modern Living</h1>
            <p>
              Discover timeless silhouettes tailored from organic cotton, mulberry silk, and heavyweight wool.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary btn-lg">
                Shop Collection
              </Link>
              <Link href="/products?category=Outerwear" className="btn btn-outline btn-lg">
                Explore Outerwear
              </Link>
            </div>
          </div>
          <div className="hero-image-box">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="StyleNest Seasonal Editorial"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link href="/products" className="text-link">View All &rarr;</Link>
        </div>
        <div className="category-grid">
          {displayCategories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              <h3>{category}</h3>
              <span>Explore &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="section-header">
          <h2>Featured Pieces</h2>
          <Link href="/products" className="text-link">Shop All &rarr;</Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best-Selling Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <Link href="/products" className="text-link">See Full Catalog &rarr;</Link>
          </div>
          <div className="product-grid">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
