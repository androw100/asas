import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingBag, Sparkles, ChevronDown } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* 1. Top Announcement Bar (Like Artha design) */}
      <div className="top-announcement-bar">
        <div className="container top-bar-container">
          <div className="top-bar-right">
            <span>✨ شحن مجاني للطلبات فوق 1,000 ريال</span>
            <span className="top-bar-divider">|</span>
            <span>📞 خدمة عملاء 24/7</span>
          </div>

          <div className="top-bar-left">
            <Link to="/contact" className="top-bar-link">تتبع الطلب</Link>
            <span className="top-bar-divider">|</span>
            <span className="top-bar-lang">
              العربية <ChevronDown size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="navbar">
        <div className="container navbar-container">
          {/* Brand Logo (Artha / Asas Luxury Monogram) */}
          <Link to="/" className="brand-wrapper" onClick={closeMobileMenu}>
            <div className="brand-monogram">
              <span className="monogram-icon">M</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">ARTHA</span>
              <span className="brand-subtitle">FURNITURE</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav aria-label="التنقل الرئيسي" className="nav-desktop">
            <ul className="nav-links">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  الرئيسية
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/collections"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  المتجر
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/collections"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  التصنيفات
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product/sofa-1"
                  className={({ isActive }) => `nav-link nav-link-highlight ${isActive ? 'active' : ''}`}
                >
                  <Sparkles size={14} />
                  <span>مصمم 3D</span>
                </NavLink>
              </li>
              <li>
                <a href={`${assetUrl('')}#about`} className="nav-link">
                  عن أرثا
                </a>
              </li>
              <li>
                <a href={`${assetUrl('')}#contact`} className="nav-link">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </nav>

          {/* Action Icons (Search, Profile, Wishlist, Cart) */}
          <div className="navbar-actions">
            <button className="nav-action-btn" aria-label="بحث" title="بحث">
              <Search size={19} />
            </button>
            <button className="nav-action-btn" aria-label="حسابي" title="تسجيل الدخول / حسابي">
              <User size={19} />
            </button>
            <Link to="/collections" className="nav-action-btn" aria-label="المفضلة" title="قائمة الرغبات">
              <Heart size={19} />
              <span className="action-badge">1</span>
            </Link>
            <Link to="/collections" className="nav-action-btn nav-cart-btn" aria-label="سلة المشتريات" title="السلة">
              <ShoppingBag size={19} />
              <span className="action-badge">2</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="nav-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" end className="mobile-nav-link" onClick={closeMobileMenu}>
                الرئيسية
              </NavLink>
            </li>
            <li>
              <NavLink to="/collections" className="mobile-nav-link" onClick={closeMobileMenu}>
                المتجر والتصنيفات
              </NavLink>
            </li>
            <li>
              <NavLink to="/product/sofa-1" className="mobile-nav-link mobile-highlight" onClick={closeMobileMenu}>
                <Sparkles size={16} />
                <span>مصمم أثاث 3D التفاعلي</span>
              </NavLink>
            </li>
            <li>
              <a href={`${assetUrl('')}#about`} className="mobile-nav-link" onClick={closeMobileMenu}>
                عن أرثا
              </a>
            </li>
            <li>
              <a href={`${assetUrl('')}#contact`} className="mobile-nav-link" onClick={closeMobileMenu}>
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
