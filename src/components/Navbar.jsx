import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
      {/* Main Navigation Bar */}
      <div className="navbar">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-wrapper" onClick={closeMobileMenu}>
            <div className="brand-monogram">
              <span className="monogram-icon">A</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">ASAS</span>
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
                <a href={`${assetUrl('')}#contact`} className="nav-link">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile menu toggle button */}
          <div className="navbar-actions">
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
                المتجر
              </NavLink>
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
