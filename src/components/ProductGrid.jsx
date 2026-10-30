import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function ProductGrid({ products = [] }) {
  const gridRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || products.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [products, prefersReducedMotion]);

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
        لم نعثر على قطع أثاث تطابق اختياراتك حالياً.
      </div>
    );
  }

  return (
    <div className="product-grid" ref={gridRef}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
