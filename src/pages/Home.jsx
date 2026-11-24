import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  Box
} from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import FAQSection from '../components/FAQSection';
import ContactForm from '../components/ContactForm';
import { products, categories } from '../data/products';
import { assetUrl } from '../utils/assetUrl';

export default function Home() {
  const [activeCategoryTab, setActiveCategoryTab] = useState('الكل');

  const filteredProducts = activeCategoryTab === 'الكل'
    ? products
    : products.filter((p) => p.category === activeCategoryTab);

  const categoryCards = [
    { name: 'الكنب', image: 'images/products/sofa-1.webp', link: '/collections?category=الكنب' },
    { name: 'كراسي', image: 'images/products/chair-1.webp', link: '/collections?category=كراسي' },
    { name: 'طاولات', image: 'images/products/dining-table-1.webp', link: '/collections?category=طاولات' }
  ];

  return (
    <div className="home-page-container">
      {/* 1. Hero Banner with 5 Value Props */}
      <Hero />

      {/* 2. Categories Carousel / Strip (Like Artha Screenshot) */}
      <section className="categories-strip-section">
        <div className="container">
          <div className="categories-pill-row">
            {/* View All Categories Card */}
            <Link to="/collections" className="category-pill-card view-all-card">
              <div className="view-all-icon-circle">
                <LayoutGrid size={22} />
              </div>
              <span className="pill-title">عرض جميع التصنيفات</span>
              <ArrowLeft size={14} className="pill-arrow" />
            </Link>

            {/* Individual Category Cards */}
            {categoryCards.map((cat) => (
              <Link to={cat.link} key={cat.name} className="category-pill-card">
                <div className="category-thumb-wrap">
                  <img src={assetUrl(cat.image)} alt={cat.name} className="category-thumb-img" />
                </div>
                <span className="pill-title">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Most Popular / Best Sellers Section (الأكثر مبيعاً) */}
      <section className="section best-sellers-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-main-title">الأكثر مبيعاً</h2>
            <div className="section-title-underline" />
          </div>

          {/* Category Filter Tabs */}
          <div className="home-filter-tabs">
            {['الكل', 'الكنب', 'كراسي', 'طاولات'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`home-tab-btn ${activeCategoryTab === tab ? 'active' : ''}`}
                onClick={() => setActiveCategoryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid-artha">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/collections" className="btn btn-outline-pill">
              <span>استكشف جميع منتجاتنا</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Interactive 3D Customizer Teaser Banner */}
      <section className="section customizer-teaser-section">
        <div className="container">
          <div className="customizer-teaser-box">
            <div className="teaser-content">
              <div className="teaser-badge">
                <Sparkles size={14} />
                <span>استوديو 3D المخصص</span>
              </div>
              <h2 className="teaser-title">
                اختبر الأثاث في مساحتك
                <br />
                قبل أن تتخذ قرار الشراء
              </h2>
              <p className="teaser-description">
                غيّر ألوان التنجيد، واختر من بين أجود أنواع الأخشاب الطبيعية، ودوّر القطعة 360 درجة لمشاهدة أدق التفاصيل الواقعية.
              </p>
              <Link to="/product/sofa-1" className="btn btn-primary-pill">
                <Box size={18} />
                <span>ابدأ تجربة التخصيص الآن</span>
              </Link>
            </div>

            <div className="teaser-preview-media">
              <img
                src={assetUrl('images/hero-living.webp')}
                alt="3D Customizer Demo"
                className="teaser-img"
              />
              <div className="teaser-floating-indicator">
                <span>دوران وتغيير ألوان مباشر</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Guarantee Bar (Exact Artha Match) */}
      <section className="trust-strip-section">
        <div className="container">
          <div className="trust-strip-card">
            <div className="trust-badge-col">
              <div className="trust-icon-wrap">
                <Truck size={24} strokeWidth={1.7} />
              </div>
              <div>
                <strong className="trust-item-title">شحن مجاني</strong>
                <p className="trust-item-sub">للطلبات فوق 1,000 ريال</p>
              </div>
            </div>

            <div className="trust-badge-col">
              <div className="trust-icon-wrap">
                <CreditCard size={24} strokeWidth={1.7} />
              </div>
              <div>
                <strong className="trust-item-title">دفع آمن</strong>
                <p className="trust-item-sub">100% حماية لبياناتك</p>
              </div>
            </div>

            <div className="trust-badge-col">
              <div className="trust-icon-wrap">
                <RotateCcw size={24} strokeWidth={1.7} />
              </div>
              <div>
                <strong className="trust-item-title">إرجاع سهل</strong>
                <p className="trust-item-sub">30 يوم لإرجاع واستبدال المنتج</p>
              </div>
            </div>

            <div className="trust-badge-col">
              <div className="trust-icon-wrap">
                <Headphones size={24} strokeWidth={1.7} />
              </div>
              <div>
                <strong className="trust-item-title">دعم 24/7</strong>
                <p className="trust-item-sub">نحن هنا لمساعدتك في أي وقت</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <FAQSection />

      {/* 7. Contact Inquiry Form */}
      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container container-narrow">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
