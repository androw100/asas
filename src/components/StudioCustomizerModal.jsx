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
  Box
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
  selectedSize,
  onSelectSize,
  selectedCushion,
  onSelectCushion,
  onAddToCart
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

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
      <div className={`studio-modal-window ${isFullScreen ? 'is-fullscreen' : ''}`}>
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

        {/* Modal Added Notification */}
        {addedToast && (
          <div className="studio-modal-toast">
            <Check size={16} />
            <span>تمت إضافة التصميم إلى السلة بنجاح!</span>
          </div>
        )}

        {/* Modal Window Body */}
        <div className="studio-modal-body">
          {/* Left / Main Column: 3D Viewport */}
          <div className="studio-viewer-pane">
            <Suspense fallback={<LoadingState message="جارٍ تحميل استوديو 3D..." />}>
              <ProductViewer
                product={product}
                selectedFinish={selectedFinish}
                isInsideModal={true}
              />
            </Suspense>
          </div>

          {/* Right Column: Customizer Options */}
          <div className="studio-options-pane">
            <div className="studio-options-inner">
              <div className="studio-price-block">
                <span className="studio-price-label">السعر الإجمالي</span>
                <div className="studio-price-row">
                  <span className="studio-price-num">{formattedPrice}</span>
                  <span className="studio-vat-tag">شامل الضريبة 15%</span>
                </div>
              </div>

              {/* Accordion Material & Finish Selectors */}
              <div className="studio-pickers-container">
                <FinishPicker
                  finishes={product.finishes}
                  selectedFinish={selectedFinish}
                  onSelectFinish={onSelectFinish}
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSelectSize={onSelectSize}
                  selectedCushion={selectedCushion}
                  onSelectCushion={onSelectCushion}
                />
              </div>

              {/* Bottom Sticky Action Bar inside Modal */}
              <div className="studio-footer-cta">
                <button
                  type="button"
                  className="btn-customizer-primary-direct studio-submit-btn"
                  onClick={handleModalAddToCart}
                >
                  <ShoppingBag size={18} />
                  <span>أضف إلى السلة ({formattedPrice})</span>
                </button>
                <button
                  type="button"
                  className="studio-btn-cancel"
                  onClick={onClose}
                >
                  إغلاق ومتابعة التسوق
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
