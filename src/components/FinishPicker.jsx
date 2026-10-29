import React from 'react';
import { Info, Check } from 'lucide-react';

export default function FinishPicker({ finishes = [], selectedFinish, onSelectFinish }) {
  if (!finishes || finishes.length === 0) return null;

  return (
    <div className="customizer-box" aria-label="تخصيص الخامات والألوان">
      <div className="customizer-header">
        <div>
          <h3 className="customizer-label">اختر المظهر المناسب لك</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '2px' }}>
            جرّب الخيارات وشاهد تأثيرها على القطعة مباشرة
          </p>
        </div>
        <span className="customizer-selected-name">
          {selectedFinish ? selectedFinish.name : 'اختر التشطيب'}
        </span>
      </div>

      <div className="swatch-group" role="radiogroup" aria-label="خيارات الألوان والتشطيبات">
        {finishes.map((finish) => {
          const isSelected = selectedFinish?.id === finish.id;

          return (
            <button
              key={finish.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={`اختيار تشطيب ${finish.name}`}
              className={`swatch-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectFinish(finish)}
            >
              <div
                className="swatch-circle"
                style={{ backgroundColor: finish.color }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: finish.color.toLowerCase() === '#ffffff' || finish.color.toLowerCase() === '#ece6dc' || finish.color.toLowerCase() === '#dfd7ca' ? '#12110e' : '#ffffff'
                    }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="swatch-name">{finish.name}</span>
            </button>
          );
        })}
      </div>

      <div className="color-disclaimer">
        <Info size={14} style={{ flexShrink: 0 }} />
        <span>يتم تطبيق التشطيب مباشرة على المجسم ثلاثي الأبعاد لتقريب المظهر لعينيك.</span>
      </div>
    </div>
  );
}
