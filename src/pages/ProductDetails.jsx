import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Bookmark,
  ShoppingBag,
  RotateCcw,
  Check,
  Truck,
  Ruler,
  Box,
  ChevronLeft
} from 'lucide-react';
import FinishPicker from '../components/FinishPicker';
import LoadingState from './../components/LoadingState';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ProductViewer = React.lazy(() => import('../components/ProductViewer'));

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedFinishOverride, setSelectedFinishOverride] = useState(null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : '240 سم');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Derived selected finish
  const selectedFinish = useMemo(() => {
    if (selectedFinishOverride) return selectedFinishOverride;
    if (!product?.finishes || product.finishes.length === 0) return null;

    const hasFabric = product.finishes.some((f) => f.group === 'fabric' || f.target === 'fabric');
    const hasWood = product.finishes.some((f) => f.group === 'wood' || f.target === 'wood');

    if (hasFabric && hasWood) {
      return [
        product.finishes.find((f) => f.group === 'fabric' || f.target === 'fabric'),
        product.finishes.find((f) => f.group === 'wood' || f.target === 'wood')
      ].filter(Boolean);
    }

    return product.finishes[0];
  }, [selectedFinishOverride, product]);

  // Similar products in same category
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedFinishOverride(null);
    if (product?.sizes) setSelectedSize(product.sizes[0]);
  }, [id, product]);

  const formattedPrice = product?.price
    ? `SAR ${product.price.toLocaleString('en-US')}`
    : 'SAR 4,250';

  const handleAddToCart = () => {
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  if (!product) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Box size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 16px auto' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>المنتج غير موجود</h1>
          <Link to="/collections" className="btn btn-primary">
            العودة إلى المتجر
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-customizer-page">
      <div className="container">
        {/* Breadcrumb Navigation (الرئيسية > الأرائك > أريكة لونا) */}
        <nav aria-label="مسار التصفح" className="customizer-breadcrumbs">
          <Link to="/" className="crumb-link">الرئيسية</Link>
          <ChevronLeft size={14} className="crumb-separator" />
          <Link to="/collections" className="crumb-link">{product.category}</Link>
          <ChevronLeft size={14} className="crumb-separator" />
          <span className="crumb-current">{product.name}</span>
        </nav>

        {/* Toast Notifications */}
        {addedToCartToast && (
          <div className="customizer-toast">
            <Check size={18} color="#2E6B44" />
            <span>تمت إضافة التصميم إلى سلة التسوق بنجاح!</span>
          </div>
        )}

        {copiedToast && (
          <div className="customizer-toast">
            <Check size={18} color="#2E6B44" />
            <span>تم نسخ رابط التصميم إلى الحافظة!</span>
          </div>
        )}

        {/* Split Customizer Layout (Viewer Left, Configurator Right) */}
        <div className="customizer-split-grid">
          {/* 1. Left Viewport Area (3D Viewer) */}
          <div className="customizer-viewer-column">
            <Suspense
              fallback={
                <div className="viewer-wrapper">
                  <LoadingState message="جارٍ تجهيز المجسم ثلاثي الأبعاد..." />
                </div>
              }
            >
              <ProductViewer product={product} selectedFinish={selectedFinish} />
            </Suspense>

            {/* Bottom Viewer Action Strip (Matches Image 2 exactly) */}
            <div className="viewer-bottom-actions-strip">
              <div className="viewer-sub-buttons-group">
                <button
                  type="button"
                  className="viewer-action-sub-btn"
                  onClick={handleShare}
                  title="مشاركة رابط التصميم"
                >
                  <Share2 size={16} />
                  <span>مشاركة</span>
                </button>

                <button
                  type="button"
                  className="viewer-action-sub-btn"
                  onClick={() => setSelectedFinishOverride(null)}
                  title="إعادة ضبط الخامات"
                >
                  <RotateCcw size={16} />
                  <span>إعادة ضبط</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-customizer-primary-direct"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>أضف إلى السلة</span>
              </button>
            </div>
          </div>

          {/* 2. Right Customizer Configurator Panel */}
          <div className="customizer-config-column">
            <div className="config-card-panel">
              {/* Header: Title, Wishlist, Price */}
              <div className="config-header">
                <div className="config-title-row">
                  <h1 className="config-product-title">{product.name}</h1>
                  <button
                    type="button"
                    className={`config-wishlist-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => setIsLiked(!isLiked)}
                    aria-label="المفضلة"
                  >
                    <Heart size={20} fill={isLiked ? '#A64D4D' : 'none'} color={isLiked ? '#A64D4D' : '#8C827A'} />
                  </button>
                </div>

                <div className="config-price-box">
                  <span className="config-price-value">{formattedPrice}</span>
                  <span className="config-vat-note">شامل ضريبة القيمة المضافة</span>
                </div>
              </div>

              {/* Accordion Material & Finish Selectors */}
              <FinishPicker
                finishes={product.finishes}
                selectedFinish={selectedFinish}
                onSelectFinish={setSelectedFinishOverride}
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />

              {/* Specifications Box */}
              <div className="config-specs-box">
                <div className="specs-box-title">
                  <Ruler size={15} />
                  <span>المواصفات وخامات التصنيع</span>
                </div>

                <div className="specs-list">
                  <div className="spec-row">
                    <span className="spec-label">المقاس والأبعاد:</span>
                    <span className="spec-value">{product.dimensions}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">خامات الهيكل:</span>
                    <span className="spec-value">{product.materialsDescription}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">الضمان:</span>
                    <span className="spec-value">ضمان شامل لمدة 5 سنوات</span>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="config-footer-actions">
                <div className="config-total-price-row">
                  <span className="total-label">السعر الإجمالي:</span>
                  <span className="total-amount">{formattedPrice}</span>
                </div>

                <div className="config-buttons-row">
                  <button
                    type="button"
                    className="btn-customizer-primary"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag size={18} />
                    <span>أضف إلى السلة</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-customizer-secondary ${isSaved ? 'saved' : ''}`}
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    <span>{isSaved ? 'تم حفظ التصميم' : 'حفظ التصميم'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Recommended Products Section */}
        {similarProducts.length > 0 && (
          <section className="similar-products-section">
            <div className="section-header-compact">
              <h2 className="section-title-compact">قطع مماثلة تناسب ذوقك</h2>
              <Link to="/collections" className="view-more-link">
                <span>تصفح الكل</span>
                <ChevronLeft size={16} />
              </Link>
            </div>

            <div className="products-four-grid">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
