import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, Crown, Sparkles, Truck, ShieldCheck, PenTool } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

export default function Hero() {
  return (
    <section className="hero-banner-section">
      <div className="container hero-container">
        {/* Main Cinematic Visual Banner (Like Artha Reference Image) */}
        <div className="hero-cinematic-card">
          <div className="hero-image-overlay" />
          <img
            src={assetUrl('images/hero-living.webp')}
            alt="صمّم أثاث أحلامك بتقنية ثلاثية الأبعاد - ARTHA FURNITURE"
            className="hero-bg-img"
          />

          {/* Hero Content Overlay */}
          <div className="hero-text-content">
            <h1 className="hero-main-title">
              صمّم أثاث أحلامك
              <br />
              <span className="hero-title-gradient">بتقنية ثلاثية الأبعاد</span>
            </h1>

            <p className="hero-main-subtitle">
              اختر التصميم، الأقمشة، الألوان والخامات،
              <br />
              وشاهد النتيجة واقعية قبل الشراء.
            </p>

            <div className="hero-btn-wrap">
              <Link to="/product/sofa-1" className="btn-hero-primary">
                <span>ابدأ التصميم</span>
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* 5 Feature Badges Bar Beneath the Hero (Exact Artha Match) */}
        <div className="hero-features-bar">
          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <Box size={20} strokeWidth={1.8} />
            </div>
            <div className="feature-text">
              <strong className="feature-title">عرض ثلاثي الأبعاد</strong>
              <span className="feature-desc">شاهد منتجك بتقنية 3D قبل تأكيد الطلب</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <Crown size={20} strokeWidth={1.8} />
            </div>
            <div className="feature-text">
              <strong className="feature-title">خامات فاخرة</strong>
              <span className="feature-desc">أقمشة وأخشاب عالية الجودة من أفضل الموردين</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <PenTool size={20} strokeWidth={1.8} />
            </div>
            <div className="feature-text">
              <strong className="feature-title">تصميم حسب ذوقك</strong>
              <span className="feature-desc">خصص كل التفاصيل لتناسب أسلوبك</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <Truck size={20} strokeWidth={1.8} />
            </div>
            <div className="feature-text">
              <strong className="feature-title">توصيل وتركيب</strong>
              <span className="feature-desc">توصيل سريع وتركيب احترافي في جميع المناطق</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <div className="feature-icon-circle">
              <ShieldCheck size={20} strokeWidth={1.8} />
            </div>
            <div className="feature-text">
              <strong className="feature-title">ضمان ممتد</strong>
              <span className="feature-desc">ضمان على الجودة حتى 5 سنوات</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
