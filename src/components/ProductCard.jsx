import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, ArrowLeft } from 'lucide-react';

function ArchitecturalPlaceholder({ category }) {
  const isTable = category === 'طاولات' || category === 'Tables';

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.85 }}
    >
      <circle cx="80" cy="80" r="64" stroke="rgba(196,164,119,0.12)" strokeWidth="1" strokeDasharray="3 3" />
      {isTable ? (
        <g>
          <ellipse cx="80" cy="130" rx="45" ry="8" fill="rgba(0,0,0,0.3)" />
          <rect x="42" y="85" width="22" height="42" rx="4" fill="#2E2C27" stroke="#C4A477" strokeWidth="1.5" />
          <rect x="96" y="85" width="22" height="42" rx="4" fill="#2E2C27" stroke="#C4A477" strokeWidth="1.5" />
          <rect x="25" y="76" width="110" height="12" rx="2" fill="#3D3933" stroke="#F1EEE7" strokeWidth="1.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="80" cy="136" rx="36" ry="6" fill="rgba(0,0,0,0.3)" />
          <line x1="56" y1="105" x2="50" y2="136" stroke="#C4A477" strokeWidth="2" />
          <line x1="104" y1="105" x2="110" y2="136" stroke="#C4A477" strokeWidth="2" />
          <rect x="48" y="92" width="64" height="14" rx="4" fill="#2E2C27" stroke="#F1EEE7" strokeWidth="1.5" />
          <path d="M 52 94 C 52 56, 108 56, 108 94" fill="none" stroke="#C4A477" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
}

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="product-card" aria-label={product.name}>
      <Link to={`/product/${product.id}`} className="product-card-media" tabIndex={-1}>
        <div className="product-badge-3d">
          <Box size={13} />
          <span>عارض 3D تفاعلي</span>
        </div>

        {product.thumbnail && !imageError ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <ArchitecturalPlaceholder category={product.category} />
        )}
      </Link>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card-description">{product.description}</p>

        <div className="product-card-footer">
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            متوفر بتشطيبات متعددة
          </span>
          <Link to={`/product/${product.id}`} className="product-card-link">
            <span>استكشف القطعة</span>
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
