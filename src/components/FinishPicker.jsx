import React from 'react';
import { Info, Check, RotateCcw, Layers } from 'lucide-react';

export default function FinishPicker({ finishes = [], selectedFinish, onSelectFinish }) {
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

  const handleResetOriginal = () => {
    onSelectFinish({
      id: 'original',
      name: 'عرض القطعة بالشكل الأصلي',
      color: '#FFFFFF'
    });
  };

  const renderSwatchBtn = (finish, isSelected, onClick) => {
    const cleanName = finish?.name ? (finish.name.includes('(') ? finish.name.split('(')[0].trim() : finish.name) : '';
    const isLight =
      finish.color?.toLowerCase() === '#ffffff' ||
      finish.color?.toLowerCase() === '#ece6dc' ||
      finish.color?.toLowerCase() === '#efece6';

    return (
      <button
        key={finish.id}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={`اختيار تشطيب ${finish.name}`}
        className={`swatch-btn ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
      >
        <div className="swatch-circle" style={{ backgroundColor: finish.color }}>
          {isSelected && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLight ? '#12110e' : '#ffffff'
              }}
            >
              <Check size={16} strokeWidth={3} />
            </div>
          )}
        </div>
        <span className="swatch-name">{cleanName}</span>
      </button>
    );
  };

  return (
    <div className="customizer-box" aria-label="تخصيص الخامات والألوان">
      <div className="customizer-header">
        <div>
          <h3 className="customizer-label">تخصيص الخامات والألوان</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '2px' }}>
            {isDualMaterial
              ? 'المنتج يحتوي على ماتيريال للقماش وماتيريال للأرجل يمكنك تغييرهما بشكل مستقل'
              : 'جرّب خيارات الخامات المدمجة من المصمم وشاهد تأثيرها مباشرة'}
          </p>
        </div>
      </div>

      {/* Selected Summary Badge */}
      <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {isDualMaterial ? (
          <>
            <span className="badge" style={{ borderColor: 'var(--color-accent)' }}>
              القماش: {currentFabric?.name?.split('(')[0]?.trim() || currentFabric?.name}
            </span>
            <span className="badge">
              الأرجل: {currentWood?.name?.split('(')[0]?.trim() || currentWood?.name}
            </span>
          </>
        ) : (
          <span className="customizer-selected-name">
            {selectedFinish?.name || 'اختر التشطيب'}
          </span>
        )}
      </div>

      {isDualMaterial ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Section 1: Fabric Materials */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Layers size={15} style={{ color: 'var(--color-accent)' }} />
              <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                1. خامة ولون القماش (الماتيريال الأولى):
              </strong>
            </div>
            <div className="swatch-group" role="radiogroup">
              {fabricFinishes.map((f) =>
                renderSwatchBtn(f, currentFabric?.id === f.id, () => handleSelectFabric(f))
              )}
            </div>
          </div>

          {/* Section 2: Wood Materials */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Layers size={15} style={{ color: 'var(--color-accent)' }} />
              <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                2. خامة ولون الأرجل والقاعدة (الماتيريال الثانية):
              </strong>
            </div>
            <div className="swatch-group" role="radiogroup">
              {woodFinishes.map((w) =>
                renderSwatchBtn(w, currentWood?.id === w.id, () => handleSelectWood(w))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="swatch-group" role="radiogroup" aria-label="خيارات الألوان والتشطيبات">
          {finishes.map((finish) => {
            const isSelected = selectedFinish?.id === finish.id;
            return renderSwatchBtn(finish, isSelected, () => onSelectFinish(finish));
          })}
        </div>
      )}

      {/* Quick Reset to Designer Defaults */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="tool-action-btn tool-reset-btn"
          onClick={handleResetOriginal}
          title="إعادة القطعة إلى خامات المصمم الأصلية"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          <RotateCcw size={14} />
          <span>استعادة الشكل الأصلي للمجسم</span>
        </button>
      </div>

      <div className="color-disclaimer">
        <Info size={14} style={{ flexShrink: 0 }} />
        <span>جميع الخامات تُعرض مباشرة من ملف الـ 3D الأصلي بدون أي تعديل أو معالجة برمجية للألوان.</span>
      </div>
    </div>
  );
}
