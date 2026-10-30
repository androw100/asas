import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assetUrl';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link to="/" className="brand-wrapper" style={{ marginBottom: '16px' }}>
              <div className="brand-logo">
                ASAS
                <span className="brand-dot" aria-hidden="true" />
              </div>
              <span className="brand-subtitle">أساس للأثاث والديكور</span>
            </Link>
            <p style={{ maxWidth: '340px', fontSize: '0.9rem', lineHeight: '1.8', marginTop: '14px', color: 'var(--color-text-muted)' }}>
              تفاصيل تصنع الفرق.
              <br />
              اكتشف الأثاث والديكورات، واستكشف تصميماتنا بتجربة ثلاثية الأبعاد تساعدك على اختيار ما يناسب ذوقك.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="footer-heading">مجموعتنا</h4>
            <ul className="footer-links">
              <li><Link to="/collections" className="footer-link">جميع القطع</Link></li>
              <li><Link to="/collections?category=كراسي ومقاعد" className="footer-link">كراسي ومقاعد</Link></li>
              <li><Link to="/collections?category=طاولات" className="footer-link">طاولات طعام معمارية</Link></li>
            </ul>
          </div>

          {/* Studio Column */}
          <div>
            <h4 className="footer-heading">تجربة 3D التفاعلية</h4>
            <ul className="footer-links">
              <li><Link to="/product/atelier-chair" className="footer-link">كرسي آتلييه الفاخر</Link></li>
              <li><Link to="/product/oak-concrete-dining-table" className="footer-link">طاولة مونوليث أوك وكونكريت</Link></li>
              <li><Link to="/product/cane-dining-chair" className="footer-link">كرسي القصب والخشب الأسود</Link></li>
              <li><Link to="/product/white-marble-gold-table" className="footer-link">طاولة الرخام الأبيض الدائرية</Link></li>
            </ul>
          </div>

          {/* Details Column */}
          <div>
            <h4 className="footer-heading">التواصل والاستفسارات</h4>
            <ul className="footer-links">
              <li><span className="footer-link" style={{ direction: 'ltr', display: 'inline-block' }}>studio@asas-living.com</span></li>
              <li><a href={`${assetUrl('')}#contact`} className="footer-link">طلب تسعيرة أو استشارة خاصة</a></li>
              <li><a href={`${assetUrl('')}#faq`} className="footer-link">الأسئلة الشائعة</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} ASAS. جميع الحقوق محفوظة.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={`${assetUrl('')}#faq`} className="footer-link" style={{ fontSize: '0.82rem' }}>الأسئلة الشائعة</a>
            <span style={{ color: 'var(--color-border)' }}>•</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>سياسة الخصوصية</span>
            <span style={{ color: 'var(--color-border)' }}>•</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>الشروط والأحكام</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
