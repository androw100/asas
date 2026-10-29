import React from 'react';
import { Box, Upload, RefreshCw, AlertCircle } from 'lucide-react';

export default function ModelErrorState({
  modelUrl,
  errorType = 'missing',
  onRetry,
  onFileSelect,
  onEnableProcedural
}) {
  const isWebGL = errorType === 'webgl';

  return (
    <div className="viewer-overlay-state">
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(196, 164, 119, 0.1)',
          border: '1px solid rgba(196, 164, 119, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-md)',
          color: 'var(--color-accent)'
        }}
      >
        {isWebGL ? <AlertCircle size={28} /> : <Box size={28} />}
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
        {isWebGL ? 'تسريع العرض ثلاثي الأبعاد غير متوفر' : 'جاهز لتحميل المجسم ثلاثي الأبعاد'}
      </h3>

      <p style={{ maxWidth: '440px', fontSize: '0.875rem', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
        {isWebGL ? (
          'المتصفح الحالي لا يدعم WebGL أو أن التسريع الرسومي معطل. يرجى تفعيل تسريع العتاد من إعدادات المتصفح.'
        ) : (
          <>
            ملف المجسم <code style={{ color: 'var(--color-accent)', padding: '2px 6px', background: 'var(--color-surface)', borderRadius: '2px' }}>{modelUrl}</code> غير موجود بالمسار الافتراضي.
          </>
        )}
      </p>

      {!isWebGL && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            fontSize: '0.85rem',
            textAlign: 'right',
            marginBottom: '20px',
            maxWidth: '460px',
            lineHeight: 1.6
          }}
        >
          <div style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: '4px' }}>
            أين تضع ملفات الموديل:
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            ضع ملف الـ <code>.glb</code> داخل المسار:
            <br />
            <strong style={{ color: 'var(--color-text-main)' }}>public{modelUrl}</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" onClick={onRetry}>
            <RefreshCw size={14} style={{ marginLeft: '6px' }} />
            إعادة المحاولة
          </button>
        )}

        {onFileSelect && (
          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={14} style={{ marginLeft: '6px' }} />
            تحميل ملف GLB محلي
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={onFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        )}

        {onEnableProcedural && (
          <button className="btn btn-outline btn-sm" onClick={onEnableProcedural}>
            معاينة مجسم افتراضي 3D
          </button>
        )}
      </div>
    </div>
  );
}
