import styles from './ProductDetail.module.css';

export default function ProductDetail({ params }) {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.mainImage}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiI2OaY17Q0a9LQSMpGlnHgoFo7pkvqaUxWmBu5QgGlhR0AcVpgQqBpJUNAvY-i6TpKFc8tlXGqyGUAARMOIlF6N-PLHOL8Q5k_2qPfbS_9YIhsx5jlXCAfYi7yJI_JJAeyOphO63qWV8jZ1RlK3N4-krTUZpjbNrMbCJ3avInB_p-bxMoL5YAjQC_N4cDoTPJ1gmBERk70pagXVLPdVuwvflP0HpV6IS_X_Sed9Ol3ejSvEBFv3gkchxDoukZWXdDGnq8t_JPWUc" alt="Product" />
            </div>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.kicker}>Texture &amp; Tone</span>
            <h1 className={styles.title}>The Drift Tee</h1>
            <p className={styles.price}>$68.00</p>
            <div className={styles.colorSection}>
              <span className={styles.sectionLabel}>Color: <strong>Dune White</strong></span>
              <div className={styles.colorSwatches}>
                {['#f5f3ef', '#ba5b3f', '#3b4a3f', '#1b1c1a'].map((c, i) => (
                  <button key={i} className={styles.swatch} style={{background: c, border: i === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)'}} />
                ))}
              </div>
            </div>
            <div className={styles.sizeSection}>
              <span className={styles.sectionLabel}>Size</span>
              <div className={styles.sizeGrid}>
                {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                  <button key={s} className={`${styles.sizeBtn} ${s === 'M' ? styles.sizeBtnActive : ''}`}>{s}</button>
                ))}
              </div>
            </div>
            <p className={styles.description}>Our proprietary slub texture creates a natural, lived-in feel from the first wear. Crafted from 100% organic Pima cotton.</p>
            <div className={styles.actions}>
              <button className={styles.addToCart}>ADD TO CART</button>
              <button className={styles.wishlistBtn}>♡</button>
            </div>
            <div className={styles.details}>
              <p>✦ Free shipping on orders over $150</p>
              <p>✦ Free 30-day returns</p>
              <p>✦ Sustainably made</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
