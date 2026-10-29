import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '580px' }}>
        <Compass size={56} style={{ color: 'var(--color-accent)', margin: '0 auto 24px auto', opacity: 0.9 }} />
        <span className="badge" style={{ marginBottom: '16px' }}>خطأ 404</span>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600, marginBottom: '16px' }}>
          الصفحة غير موجودة
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px' }}>
          الصفحة أو القطعة التي تبحث عنها غير متوفرة أو قد تم نقلها.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            العودة للرئيسية
          </Link>
          <Link to="/collections" className="btn btn-secondary">
            استكشف مجموعتنا
          </Link>
        </div>
      </div>
    </div>
  );
}
