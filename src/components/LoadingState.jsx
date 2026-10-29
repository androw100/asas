import React from 'react';

export default function LoadingState({ message = 'جارٍ تحميل التجربة ثلاثية الأبعاد...' }) {
  return (
    <div className="viewer-overlay-state" role="status" aria-live="polite">
      <div className="viewer-loader-spinner" aria-hidden="true" />
      <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', marginTop: '6px' }}>
        تهيئة الخامات والإضاءة التفاعلية
      </p>
    </div>
  );
}
