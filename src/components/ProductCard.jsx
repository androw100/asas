import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Box, Star, ArrowLeft } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = product.price
    ? `${product.price.toLocaleString('ar-SA')} ريال`
    : '4,250 ريال';

  // Clean Arabic title (remove English text in parentheses if exists)
  const cleanTitle = product.name ? product.name.split('(')[0].trim() : product.name;

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Top Favorite Toggle & 3D Badge */}
      <div className="product-card-header">
        <button
          type="button"
          className={`card-wishlist-btn ${isLiked ? 'liked' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          aria-label="إضافة للمفضلة"
        >
          <Heart size={18} fill={isLiked ? '#A64D4D' : 'none'} color={isLiked ? '#A64D4D' : '#8C827A'} />
        </button>

        <span className="card-badge-3d">
          <Box size={13} />
          <span>3D</span>
        </span>
      </div>

      {/* Product Image Media */}
      <Link to={`/product/${product.id}`} className="product-card-media">
        {product.thumbnail && !imageError ? (
          <img
            src={product.thumbnail}
            alt={cleanTitle}
            onError={() => setImageError(true)}
            loading="lazy"
            className="product-card-img"
          />
        ) : (
          <div className="product-card-placeholder">
            <Box size={42} strokeWidth={1.5} color="var(--color-accent)" />
          </div>
        )}
      </Link>

      {/* Product Information (Centered Luxury Style) */}
      <div className="product-card-body">
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{cleanTitle}</Link>
        </h3>

        <div className="product-card-price-row">
          <span className="product-card-price">{formattedPrice}</span>
        </div>

        {/* Rating & Reviews */}
        <div className="product-card-rating">
          <Star size={13} fill="#C29B38" color="#C29B38" />
          <span className="rating-score">{product.rating || '4.8'}</span>
          <span className="rating-count">({product.reviewsCount || '110'})</span>
        </div>
      </div>
    </article>
  );
}
