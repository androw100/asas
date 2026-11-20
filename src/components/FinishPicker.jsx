import React, { useState } from 'react';
import { Layers, Check, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function FinishPicker({ finishes = [], selectedFinish, onSelectFinish, sizes = [], selectedSize, onSelectSize }) {
  const [openSection, setOpenSection] = useState('fabric'); // 'fabric' | 'wood' | 'size' | 'all'

  if (!finishes || finishes.length === 0) return null;

  const fabricFinishes = finishes.filter((f) => f.group === 'fabric' || f.target === 'fabric');
  const woodFinishes = finishes.filter((f) => f.group === 'wood' || f.target === 'wood');
  const isDualMaterial = fabricFinishes.length > 0 && woodFinishes.length > 0;

  // Active selections
  const currentFabric = Array.isArray(selectedFinish)
    ? selectedFinish.find((f) => f?.target === 'fabric' || f?.group === 'fabric') || fabricFinishes[0]
    : selectedFinish?.target === 'fabric' || selectedFinish?.group === 'fabric'
    ? selectedFinish
    : fabricFinishes[0] || finishes[0];

  const currentWood = Array.isArray(selectedFinish)
    ? selectedFinish.find((f) => f?.target === 'wood' || f?.group === 'wood') || woodFinishes[0]
    : selectedFinish?.target === 'wood' || selectedFinish?.group === 'wood'
    ? selectedFinish
    : woodFinishes[0] || null;

  const handleSelectFabric = (f) => {
    if (isDualMaterial) {
      onSelectFinish([f, currentWood].filter(Boolean));
    } else {
      onSelectFinish(f);
    }
  };

  const handleSelectWood = (w) => {
    if (isDualMaterial) {
      onSelectFinish([currentFabric, w].filter(Boolean));
    } else {
      onSelectFinish(w);
    }
  };

  const renderSwatchBtn = (finish, isSelected, onClick) => {
    const cleanName = finish?.name ? (finish.name.includes('(') ? finish.name.split('(')[0].trim() : finish.name) : '';
    const isLight =
      finish.color?.toLowerCase() === '#ffffff' ||
      finish.color?.toLowerCase() === '#ede8df' ||
      finish.color?.toLowerCase() === '#d4c4b1' ||
      finish.color?.toLowerCase() === '#c6b6a3';

    return (
      <button
        key={finish.id}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={`اختيار ${finish.name}`}
        className={`customizer-swatch-item ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        title={finish.name}
      >
        <div className="swatch-outer-ring">
          <div className="swatch-inner-circle" style={{ backgroundColor: finish.color }}>
            {isSelected && (
              <Check size={14} strokeWidth={3} color={isLight ? '#2B221B' : '#FFFFFF'} />
            )}
          </div>
        </div>
        <span className="swatch-title-label">{cleanName}</span>
      </button>
    );
  };

  return (
    <div className="customizer-accordions-group" aria-label="أدوات التخصيص 3D">
      {/* 1. Fabric Section (القماش) */}
      {fabricFinishes.length > 0 && (
        <div className="customizer-accordion-card">
          <button
            type="button"
            className="accordion-header-btn"
            onClick={() => setOpenSection(openSection === 'fabric' ? '' : 'fabric')}
          >
            <div className="accordion-title-wrap">
              <span className="accordion-icon-box">🛋️</span>
              <div>
                <span className="accordion-main-title">القماش</span>
                <span className="accordion-sub-title">
                  {currentFabric?.name ? currentFabric.name.split('(')[0].trim() : 'اختر نوع ولون القماش'}
                </span>
              </div>
            </div>
            {openSection === 'fabric' ? <ChevronUp size={18} color="var(--color-text-dim)" /> : <ChevronDown size={18} color="var(--color-text-dim)" />}
          </button>

          {openSection === 'fabric' && (
            <div className="accordion-body-content">
              <div className="swatches-flex-grid">
                {fabricFinishes.map((f) =>
                  renderSwatchBtn(f, currentFabric?.id === f.id, () => handleSelectFabric(f))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Wood Base Section (الخشب) */}
      {woodFinishes.length > 0 && (
        <div className="customizer-accordion-card">
          <button
            type="button"
            className="accordion-header-btn"
            onClick={() => setOpenSection(openSection === 'wood' ? '' : 'wood')}
          >
            <div className="accordion-title-wrap">
              <span className="accordion-icon-box">🪵</span>
              <div>
                <span className="accordion-main-title">الخشب والقاعدة</span>
                <span className="accordion-sub-title">
                  {currentWood?.name ? currentWood.name.split('(')[0].trim() : 'اختر نوع ولون الخشب'}
                </span>
              </div>
            </div>
            {openSection === 'wood' ? <ChevronUp size={18} color="var(--color-text-dim)" /> : <ChevronDown size={18} color="var(--color-text-dim)" />}
          </button>

          {openSection === 'wood' && (
            <div className="accordion-body-content">
              <div className="swatches-flex-grid">
                {woodFinishes.map((w) =>
                  renderSwatchBtn(w, currentWood?.id === w.id, () => handleSelectWood(w))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Size Section (المقاس) */}
      {sizes && sizes.length > 0 && (
        <div className="customizer-accordion-card">
          <button
            type="button"
            className="accordion-header-btn"
            onClick={() => setOpenSection(openSection === 'size' ? '' : 'size')}
          >
            <div className="accordion-title-wrap">
              <span className="accordion-icon-box">📐</span>
              <div>
                <span className="accordion-main-title">المقاس</span>
                <span className="accordion-sub-title">{selectedSize || sizes[0]}</span>
              </div>
            </div>
            {openSection === 'size' ? <ChevronUp size={18} color="var(--color-text-dim)" /> : <ChevronDown size={18} color="var(--color-text-dim)" />}
          </button>

          {openSection === 'size' && (
            <div className="accordion-body-content">
              <div className="size-options-grid">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill-btn ${(selectedSize || sizes[0]) === s ? 'active' : ''}`}
                    onClick={() => onSelectSize && onSelectSize(s)}
                  >
                    <span>{s}</span>
                    {(selectedSize || sizes[0]) === s && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
