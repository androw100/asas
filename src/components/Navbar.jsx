import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Wordmark & Arabic Slogan */}
        <Link to="/" className="brand-wrapper" onClick={closeMobileMenu}>
          <div className="brand-logo">
            ASAS
            <span className="brand-dot" aria-hidden="true" />
          </div>
          <span className="brand-subtitle">أساس للأثاث والديكور</span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="التنقل الرئيسي">
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                الرئيسية
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collections"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                مجموعتنا
              </NavLink>
            </li>
            <li>
              <a href="/#about" className="nav-link" onClick={closeMobileMenu}>
                من نحن
              </a>
            </li>
            <li>
              <a href="/#faq" className="nav-link" onClick={closeMobileMenu}>
                الأسئلة الشائعة
              </a>
            </li>
            <li>
              <a href="/#contact" className="nav-link" onClick={closeMobileMenu}>
                تواصل معنا
              </a>
            </li>
            <li>
              <NavLink
                to="/product/atelier-chair"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)' }}
              >
                <Sparkles size={15} />
                <span>تجربة 3D</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className="nav-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
