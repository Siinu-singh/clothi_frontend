'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './Catalog.module.css';

const products = [
  { id: 1, name: 'The Drift Tee', color: 'Dune White', price: '$68', badge: null, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiI2OaY17Q0a9LQSMpGlnHgoFo7pkvqaUxWmBu5QgGlhR0AcVpgQqBpJUNAvY-i6TpKFc8tlXGqyGUAARMOIlF6N-PLHOL8Q5k_2qPfbS_9YIhsx5jlXCAfYi7yJI_JJAeyOphO63qWV8jZ1RlK3N4-krTUZpjbNrMbCJ3avInB_p-bxMoL5YAjQC_N4cDoTPJ1gmBERk70pagXVLPdVuwvflP0HpV6IS_X_Sed9Ol3ejSvEBFv3gkchxDoukZWXdDGnq8t_JPWUc' },
  { id: 2, name: 'Sienna Basin Tee', color: 'Terracotta', price: '$72', badge: 'New Arrival', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMwjdSnsnLgo61GIx8kUzwlmrwx6cK1LpKm4RZLC3P8xr0s2E63kRPA4sxI9CkanZ_zfi5CZjIGitTfDsqLoje8FHDz_vrNl7YeSVvjhickha9Xyut7HcQw1W_Ifao5gSKjyArZDFiqj2DM0yrGOVCtZFrJ1hDdqJukjLn_OyDKkuAP4iF1Ki1N3WFK-_MML9EiH2c4LuWVrAxzJetxOk1rPz59GyaVesmV_mzOQqWWJQM07grVqZT3rKXNUhi64cNgm6zQbtV19Y' },
  { id: 3, name: 'Cove Pocket Tee', color: 'Forest Floor', price: '$65', badge: null, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0O8lQ5l8re4d_q42pm4zJzSOGA7VASCD0mnjh_YxIx2eeiOk7JPcNr6dPVsXADu5KRPffcjMABxGrlnyna8laE8eNJOSA6-KXPrQufWuZMOFoOS37BHGaSyOSR0LwLXdO19J_mYYcdCRyuHsU3k-bNxUP4XEPnIbrcemIsueHiXrR6v9DXTgLRZFoIqbswPq59K4itWefVRHHFm_2rao5fzgfsS0TG_Fsa1Rrs32AqKuPQmopMXTM2UrtTX5mruUmS88z95E2da0' },
  { id: 4, name: 'Tidal Wash Tee', color: 'Pacific Mist', price: '$88', badge: null, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs6tU1INRCrUA0VjOhmSNGQojLeLjC4iIw9pWZ0VRPfWAc7DjXTbRPKOV1N99KS2T9XtqOJpH8567bRHHgBdqPSelCz7PGH21NxDq_KhtmthzA_OXeXGTly_omGXyA3T5L6p3OiobClFMrzSdkBtRsTAN9NFw9BYFYhysjJmvBPqfgOe0Q9mcSOz0NTb8x4MgmSMr_NyR0bbgDGApCmvd0BQANfCHFtBelehrSJsLBnkRDnTH2W5KMUrLwO4IHigapRQemkUpzwjw' },
  { id: 5, name: 'Basalt Heavy Tee', color: 'Volcanic Ash', price: '$95', badge: null, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXcQp7THH9oG72Uw-JyJX8TGRYUb78gzdcSIW0vWqzrRPlnMeRqhWrVYLxBZYRh55uzdJpKgA_CSi9ElBvKFxNuFMpgfqfKk83VH_62klIAc0u7P6-gbY_ek1vKyVUH5swBpXHeiFBgWDoHOAf_iH5lH8t9kdVTumlOL3Ssy6-B4rmW1JH7hWK4qrsottD6jVvF3UB3uM1UKoo_SJIKAsbainEY7dzD_HYs2EDlwkgixEtxBc4bn21RwENeL19AR79EYJspJAJgY' },
  { id: 6, name: 'Golden Hour Slub', color: 'Coast Sand', price: '$58', badge: 'Low Stock', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHegRshC9sVRZ3dyVqScGyt1nNUGJJLy9WhMIgfuN-Kkb3wx9rP9yf6tDqbVMLVerg4d72ks2ZdI1px8v57kXcK-8Qs4mrdCeYy1dmOzXd1ICycHvVXRXSxRHjSNbdIw13-qNEJFH_EZFi-T0ohcLi9KOv9kLWop8PJyeexnY7fjHjpoUCTpnC1sOnWEgUWWbf17O7Ke4mlBkGbh0u7lwc8hKipp-ofO4zwFb3lP9sVmzNbj4mxoOBP9_hmeNniXJlCOT7gzO_kXg' },
];

export default function Catalog() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>Premium Essentials</span>
          <h1 className={styles.title}>Sun-drenched T-Shirts</h1>
          <p className={styles.subtitle}>A collection inspired by coastal winds and the tactile warmth of the Mediterranean sun.</p>
        </header>

        <div className={styles.layout}>
          {/* Filter Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <h2 className={styles.filterTitle}>Filters</h2>
              
              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Size</h3>
                <div className={styles.sizeGrid}>
                  {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                    <button key={s} className={`${styles.sizeBtn} ${s === 'M' ? styles.sizeBtnActive : ''}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Color</h3>
                <div className={styles.colorGrid}>
                  {['#f5f3ef', '#ba5b3f', '#3b4a3f', '#1b1c1a', '#8b9ba5'].map((c, i) => (
                    <button key={i} className={styles.colorBtn} style={{background: c, border: i === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)'}}></button>
                  ))}
                </div>
              </div>

              <button className={styles.clearBtn}>CLEAR ALL</button>
            </div>
          </aside>

          {/* Product Grid */}
          <section className={styles.grid}>
            <div className={styles.gridHeader}>
              <span className={styles.resultCount}>Showing {products.length} results</span>
              <select className={styles.sort}>
                <option>Curated</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
              </select>
            </div>
            <div className={styles.productGrid}>
              {products.map(p => (
                <Link href={`/product/${p.id}`} key={p.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={p.img} alt={p.name} />
                    {p.badge && <span className={styles.badge}>{p.badge}</span>}
                    <button className={styles.wishlistBtn} onClick={(e) => e.preventDefault()}>
                      <Heart size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <div>
                      <h4 className={styles.productName}>{p.name}</h4>
                      <p className={styles.productColor}>{p.color}</p>
                    </div>
                    <p className={styles.productPrice}>{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.loadMore}>
              <button className={styles.loadMoreBtn}>DISCOVER MORE</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
