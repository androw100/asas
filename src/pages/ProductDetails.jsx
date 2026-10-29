import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Ruler, Box, Sparkles } from 'lucide-react';
import FinishPicker from '../components/FinishPicker';
import LoadingState from '../components/LoadingState';
import ContactForm from '../components/ContactForm';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const ProductViewer = React.lazy(() => import('../components/ProductViewer'));

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);

  // Maintain finish override state; defaults cleanly to first finish without synchronous setState inside useEffect
  const [selectedFinishOverride, setSelectedFinishOverride] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Derived selected finish
  const selectedFinish =
    selectedFinishOverride && product?.finishes?.some((f) => f.id === selectedFinishOverride.id)
      ? selectedFinishOverride
      : product?.finishes?.[0] || null;

  // Similar products in same category
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product]);

  useEffect(() => {
    // Scroll to top when opening a product
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Box size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 16px auto' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>المنتج غير موجود</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            القطعة التي تبحث عنها غير متوفرة حالياً أو ربما تم تحديث رابطها.
          </p>
          <Link to="/collections" className="btn btn-primary">
            العودة إلى مجموعتنا
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '85vh', paddingTop: 'var(--space-xl)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="مسار التصفح" style={{ marginBottom: 'var(--space-xl)' }}>
          <Link
            to="/collections"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              color: 'var(--color-text-muted)',
              fontWeight: 500
            }}
          >
            <ArrowRight size={16} />
            <span>العودة إلى كل المجموعات</span>
          </Link>
        </nav>

        {/* Section Intro */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <span className="badge" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} style={{ marginLeft: '4px' }} />
            {product.category}
          </span>
          <h1 className="detail-title">{product.name}</h1>
          <p style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '1rem', marginTop: '4px' }}>
            {product.tagline}
          </p>
        </div>

        {/* Split Layout: 3D Viewport on Left, Specs on Right */}
        <div className="product-detail-layout">
          {/* 3D Viewport */}
          <div>
            <Suspense
              fallback={
                <div className="viewer-wrapper">
                  <LoadingState message="جارٍ تجهيز العارض ثلاثي الأبعاد..." />
                </div>
              }
            >
              <ProductViewer product={product} selectedFinish={selectedFinish} />
            </Suspense>

            <div style={{ marginTop: '16px', background: 'var(--color-surface)', padding: '16px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
              <strong style={{ color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                اكتشف القطعة من كل زاوية
              </strong>
              تعرّف على تفاصيل التصميم، وجرّب الألوان والتشطيبات المتاحة، وشاهد كيف يتغير مظهر القطعة مباشرة على المجسم ثلاثي الأبعاد.
            </div>
          </div>

          {/* Editorial Details & Customizer Panel */}
          <div className="detail-panel">
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', lineHeight: '1.85' }}>
              {product.description}
            </p>

            {/* Finish & Material Customizer */}
            <FinishPicker
              finishes={product.finishes}
              selectedFinish={selectedFinish}
              onSelectFinish={setSelectedFinishOverride}
            />

            {/* Specifications */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--color-text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                <Ruler size={16} style={{ color: 'var(--color-accent)' }} />
                <span>المواصفات والأبعاد الفعلية</span>
              </div>
              <div style={{ display: 'grid', gap: '10px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--color-text-dim)' }}>الأبعاد:</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>{product.dimensions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--color-text-dim)' }}>التشطيب المحدد:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                    {selectedFinish?.name}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-dim)' }}>الخامات:</span>
                  <span style={{ color: 'var(--color-text-main)', textAlign: 'left', maxWidth: '65%' }}>
                    {product.materialsDescription}
                  </span>
                </div>
              </div>
            </div>

            {/* Inquiry Form Trigger */}
            <div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setShowInquiryModal(true)}
              >
                <MessageSquare size={16} style={{ marginLeft: '6px' }} />
                <span>استفسر عن السعر والتفاصيل</span>
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '8px' }}>
                تواصل معنا لتأكيد التوافر والمقاسات وخيارات التوريد لمشروعك.
              </p>
            </div>

            {/* Embedded Inquiry Form Modal */}
            {showInquiryModal && (
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-active)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-lg)',
                  marginTop: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    طلب تسعيرة لـ: {product.name}
                  </h4>
                  <button
                    onClick={() => setShowInquiryModal(false)}
                    style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    إغلاق ✕
                  </button>
                </div>
                <ContactForm initialProduct={`${product.name} - تشطيب: ${selectedFinish?.name || 'الأصلي'}`} />
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div style={{ marginTop: 'var(--space-4xl)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-2xl)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--space-xl)' }}>
              منتجات مشابهة في تصنيف {product.category}
            </h3>
            <div className="product-grid">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
