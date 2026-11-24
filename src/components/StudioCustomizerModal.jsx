import React, { useState, useEffect, Suspense } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ShoppingBag,
  RotateCcw,
  Check,
  Share2,
  Sparkles,
  Layers,
  ChevronDown,
  Box,
  Sliders,
  Save,
  BookmarkCheck
} from 'lucide-react';
import FinishPicker from './FinishPicker';
import LoadingState from './LoadingState';

const ProductViewer = React.lazy(() => import('./ProductViewer'));

export default function StudioCustomizerModal({
  isOpen,
  onClose,
  product,
  selectedFinish,
  onSelectFinish,
  sizes,
  selectedSize,
  onSelectSize,
  selectedCushion,
  onSelectCushion,
  onAddToCart
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [addedToast, setAddedToast] = useState(false);
  const [savedDesignToast, setSavedDesignToast] = useState(false);
  const [isDesignSaved, setIsDesignSaved] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const cleanTitle = product.name ? product.name.split('(')[0].trim() : 'أريكة فاخرة';
  const formattedPrice = product.price
    ? `SAR ${product.price.toLocaleString('en-US')}`
    : 'SAR 4,250';

  const handleModalAddToCart = () => {
    onAddToCart && onAddToCart();
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleSaveDesign = () => {
    try {
      const savedDesignsKey = 'asas_saved_designs';
      const existing = JSON.parse(localStorage.getItem(savedDesignsKey) || '[]');

      const newDesign = {
        id: `design-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        thumbnail: product.thumbnail,
        price: product.price,
        finish: selectedFinish,
        size: selectedSize,
        cushion: selectedCushion,
        savedAt: new Date().toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      // Keep latest designs
      const updated = [
        newDesign,
        ...existing.filter((d) => d.productId !== product.id || JSON.stringify(d.finish) !== JSON.stringify(selectedFinish))
      ].slice(0, 25);

      localStorage.setItem(savedDesignsKey, JSON.stringify(updated));

      // Sync active finish with the main product page
      if (onSelectFinish && selectedFinish) {
        onSelectFinish(selectedFinish);
      }

      setIsDesignSaved(true);
      setSavedDesignToast(true);
      setTimeout(() => setSavedDesignToast(false), 3000);
      setTimeout(() => setIsDesignSaved(false), 4000);
    } catch (err) {
      console.warn('Could not save design:', err);
      setIsDesignSaved(true);
      setSavedDesignToast(true);
      setTimeout(() => setSavedDesignToast(false), 2500);
    }
  };

  return (
    <div
      className="studio-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="استوديو التخصيص ثلاثي الأبعاد"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`studio-modal-window ${isFullScreen ? 'is-fullscreen' : ''}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Modal Window Header */}
        <div className="studio-modal-header">
          <div className="studio-header-title-wrap">
            <div className="studio-brand-badge">
              <Sparkles size={15} color="#8C7A5B" />
              <span>استوديو التخصيص الفاخر</span>
            </div>
            <h2 className="studio-product-heading">{cleanTitle}</h2>
          </div>

          <div className="studio-header-actions">
            <button
              type="button"
              className={`studio-win-btn ${isDesignSaved ? 'saved' : ''}`}
              onClick={handleSaveDesign}
              title="حفظ هذا التصميم"
              aria-label="حفظ هذا التصميم"
            >
              {isDesignSaved ? <BookmarkCheck size={18} color="#2E6B44" /> : <Save size={18} />}
            </button>
            <button
              type="button"
              className="studio-win-btn"
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'تصغير النافذة' : 'تكبير ملء الشاشة'}
              aria-label="تغيير حجم النافذة"
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              type="button"
              className="studio-win-btn studio-close-btn"
              onClick={onClose}
              title="إغلاق النافذة (Esc)"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Saved Design Notification */}
        {savedDesignToast && (
          <div className="studio-modal-toast studio-save-toast">
            <BookmarkCheck size={18} color="#2E6B44" />
            <span>تم حفظ خيارات تصميمك بنجاح وتطبيقها على المنتج!</span>
          </div>
        )}

        {/* Modal Added Notification */}
        {addedToast && (
          <div className="studio-modal-toast">
            <Check size={16} />
            <span>تمت إضافة التصميم إلى السلة بنجاح!</span>
          </div>
        )}

        {/* Modal Window Body: Full-Bleed 3D Viewport with Floating Glassmorphism Options */}
        <div className="studio-modal-body">
          {/* 1. Full-Window 3D Viewport taking the entire window */}
          <div className="studio-viewer-pane">
            <Suspense fallback={<LoadingState message="جارٍ تحميل استوديو 3D..." />}>
              <ProductViewer
                product={product}
                selectedFinish={selectedFinish}
                isInsideModal={true}
                fullWindow={true}
              />
            </Suspense>
          </div>

          {/* 2. Floating Open Button (When options panel is collapsed) */}
          {!isOptionsOpen && (
            <button
              type="button"
              className="studio-floating-open-btn"
              onClick={() => setIsOptionsOpen(true)}
              title="إظهار خيارات وتخصيص القطعة"
            >
              <Sliders size={18} />
              <span>خيارات التخصيص</span>
            </button>
          )}

          {/* 3. Small Floating Glassmorphism Options Panel inside the 3D window */}
          {isOptionsOpen && (
            <div className="studio-floating-panel" role="region" aria-label="خيارات التخصيص">
              <div className="studio-floating-header">
                <div className="studio-floating-price">
                  <span className="floating-price-num">{formattedPrice}</span>
                  <span className="floating-vat-tag">شامل ضريبة القيمة المضافة</span>
                </div>
                <button
                  type="button"
                  className="studio-floating-close-btn"
                  onClick={() => setIsOptionsOpen(false)}
                  title="طي لوحة الخيارات"
                  aria-label="طي لوحة الخيارات"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Scrollable Pickers Body */}
              <div className="studio-floating-body">
                <FinishPicker
                  finishes={product.finishes}
                  selectedFinish={selectedFinish}
                  onSelectFinish={onSelectFinish}
                  sizes={sizes || product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={onSelectSize}
                  selectedCushion={selectedCushion}
                  onSelectCushion={onSelectCushion}
                />
              </div>

              {/* Sticky Action Footer */}
              <div className="studio-floating-footer">
                <div className="studio-footer-actions-grid">
                  <button
                    type="button"
                    className={`studio-save-design-btn ${isDesignSaved ? 'is-saved' : ''}`}
                    onClick={handleSaveDesign}
                    title="حفظ هذا التصميم والخيارات للرجوع إليها لاحقاً"
                  >
                    {isDesignSaved ? <BookmarkCheck size={18} className="saved-icon" /> : <Save size={18} />}
                    <span>{isDesignSaved ? 'تم الحفظ' : 'حفظ التصميم'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-customizer-primary-direct studio-submit-btn"
                    onClick={handleModalAddToCart}
                  >
                    <ShoppingBag size={18} />
                    <span>أضف إلى السلة</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
