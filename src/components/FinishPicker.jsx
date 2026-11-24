import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function FinishPicker({
  finishes = [],
  selectedFinish,
  onSelectFinish,
  sizes = [],
  selectedSize,
  onSelectSize,
  selectedCushion,
  onSelectCushion
}) {
  const fabricFinishes = finishes.filter((f) => f.group === 'fabric' || f.target === 'fabric');
  const woodFinishes = finishes.filter((f) => f.group === 'wood' || f.target === 'wood');
  const isDualMaterial = fabricFinishes.length > 0 && woodFinishes.length > 0;

  // Accordion open states - in Image 2, all sections are visible or toggled
  const [openSections, setOpenSections] = useState({
    fabric: true,
    wood: true,
    size: true,
    cushion: true
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  // Default cushion options matching Image 2
  const cushionOptions = [
    { id: 'cushion-camel', name: 'وسادة جلد جملي (Camel)', color: '#A86B42' },
    { id: 'cushion-cream', name: 'وسادة قماش عاجي (Cream)', color: '#EDE8DF' }
  ];

  const activeCushion = selectedCushion || cushionOptions[0].id;

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

  // Renders a sleek circular swatch matching Image 2 (outer ring on active, no text underneath)
  const renderSwatchItem = (item, isSelected, onClick) => {
    const cleanName = item?.name ? item.name.split('(')[0].trim() : '';

    return (
      <button
        key={item.id}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={cleanName}
        className={`luxury-swatch-circle ${isSelected ? 'is-selected' : ''}`}
        onClick={onClick}
        title={cleanName}
      >
        <span className="luxury-swatch-inner" style={{ backgroundColor: item.color }} />
      </button>
    );
  };

  const availableSizes = sizes && sizes.length > 0 ? sizes : ['240 سم', '280 سم', '320 سم'];
  const activeSize = selectedSize || availableSizes[0];

  return (
    <div className="customizer-accordions-group" aria-label="أدوات التخصيص 3D">
      {/* 1. Fabric Accordion (القماش) */}
      {fabricFinishes.length > 0 && (
        <div className="customizer-accordion-card">
          <button
            type="button"
            className="accordion-header-btn"
            onClick={() => toggleSection('fabric')}
          >
            <div className="accordion-title-wrap">
              <span className="accordion-icon-box">🛋️</span>
              <div>
                <span className="accordion-main-title">القماش</span>
                <span className="accordion-sub-title">اختر نوع ولون القماش</span>
              </div>
            </div>
            {openSections.fabric ? (
              <ChevronUp size={16} color="var(--color-text-dim)" />
            ) : (
              <ChevronDown size={16} color="var(--color-text-dim)" />
            )}
          </button>

          {openSections.fabric && (
            <div className="accordion-body-content">
              <div className="swatches-horizontal-row">
                {fabricFinishes.map((f) =>
                  renderSwatchItem(f, currentFabric?.id === f.id, () => handleSelectFabric(f))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Wood Base Accordion (الخشب) */}
      {woodFinishes.length > 0 && (
        <div className="customizer-accordion-card">
          <button
            type="button"
            className="accordion-header-btn"
            onClick={() => toggleSection('wood')}
          >
            <div className="accordion-title-wrap">
              <span className="accordion-icon-box">🪵</span>
              <div>
                <span className="accordion-main-title">الخشب</span>
                <span className="accordion-sub-title">اختر نوع ولون الخشب</span>
              </div>
            </div>
            {openSections.wood ? (
              <ChevronUp size={16} color="var(--color-text-dim)" />
            ) : (
              <ChevronDown size={16} color="var(--color-text-dim)" />
            )}
          </button>

          {openSections.wood && (
            <div className="accordion-body-content">
              <div className="swatches-horizontal-row">
                {woodFinishes.map((w) =>
                  renderSwatchItem(w, currentWood?.id === w.id, () => handleSelectWood(w))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Size Accordion (المقاس) */}
      <div className="customizer-accordion-card">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('size')}
        >
          <div className="accordion-title-wrap">
            <span className="accordion-icon-box">📐</span>
            <div>
              <span className="accordion-main-title">المقاس</span>
              <span className="accordion-sub-title">اختر المقاس المناسب</span>
            </div>
          </div>
          {openSections.size ? (
            <ChevronUp size={16} color="var(--color-text-dim)" />
          ) : (
            <ChevronDown size={16} color="var(--color-text-dim)" />
          )}
        </button>

        {openSections.size && (
          <div className="accordion-body-content">
            <div className="luxury-size-select-wrapper">
              <select
                className="luxury-size-dropdown"
                value={activeSize}
                onChange={(e) => onSelectSize && onSelectSize(e.target.value)}
                aria-label="اختر المقاس"
              >
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="luxury-dropdown-arrow" />
            </div>
          </div>
        )}
      </div>

      {/* 4. Cushions Accordion (الوسائد) matching Image 2 */}
      <div className="customizer-accordion-card">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('cushion')}
        >
          <div className="accordion-title-wrap">
            <span className="accordion-icon-box">🪑</span>
            <div>
              <span className="accordion-main-title">الوسائد</span>
              <span className="accordion-sub-title">اختر شكل ولون الوسائد</span>
            </div>
          </div>
          {openSections.cushion ? (
            <ChevronUp size={16} color="var(--color-text-dim)" />
          ) : (
            <ChevronDown size={16} color="var(--color-text-dim)" />
          )}
        </button>

        {openSections.cushion && (
          <div className="accordion-body-content">
            <div className="swatches-horizontal-row">
              {cushionOptions.map((c) =>
                renderSwatchItem(c, activeCushion === c.id, () => {
                  onSelectCushion && onSelectCushion(c.id);
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
