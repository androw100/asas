import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { products, categories } from '../data/products';
import { Search } from 'lucide-react';

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'جميع المنتجات';
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (currentCategory !== 'جميع المنتجات') {
      result = result.filter(
        (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.tagline && p.tagline.toLowerCase().includes(term))
      );
    }

    if (sortBy === 'featured') {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [currentCategory, searchTerm, sortBy]);

  const handleSelectCategory = (cat) => {
    if (cat === 'جميع المنتجات') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: 'var(--space-2xl)' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>مجموعتنا</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 600, marginBottom: '16px' }}>
            اكتشف مجموعتنا
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
            تصفّح مجموعة ASAS من الأثاث والديكورات، وقارن بين التصميمات والألوان والتفاصيل لتختار ما يناسب ذوقك ومساحتك.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', width: '100%' }}>
          {/* Category Filters */}
          <div className="filter-bar" role="tablist" aria-label="تصنيفات المنتجات" style={{ marginBottom: 0, maxWidth: '100%' }}>
            {categories.map((cat) => {
              const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', maxWidth: '100%', flex: '1 1 auto' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}>
              <input
                type="text"
                placeholder="ابحث بالاسم أو الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingRight: '36px', height: '40px', fontSize: '0.85rem', width: '100%' }}
              />
              <Search
                size={16}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="ترتيب المنتجات"
              style={{ flex: '0 0 auto' }}
            >
              <option value="featured">المنتجات المميزة</option>
              <option value="all">عرض الكل</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
