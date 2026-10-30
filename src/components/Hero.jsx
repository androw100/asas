import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { assetUrl } from '../utils/assetUrl';

export default function Hero() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const imageCardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Use fromTo so Strict Mode remounts never leave opacity stuck at 0
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge-anim', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
        .fromTo(
          '.hero-word-anim',
          { y: 45, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.12 },
          '-=0.5'
        )
        .fromTo('.hero-desc-anim', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.6')
        .fromTo(
          '.hero-cta-anim',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 },
          '-=0.5'
        )
        .fromTo('.hero-sub-anim', { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.4');

      gsap.fromTo(
        imageCardRef.current,
        { scale: 0.94, y: 40, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1.4, ease: 'power2.out', delay: 0.2 }
      );

      gsap.to('.hero-floating-badge', {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="container">
        <div className="hero-grid">
          {/* Right Text Column (RTL) */}
          <div className="hero-content">
            <div className="hero-subtitle hero-badge-anim">
              <span>ASAS — تفاصيل تصنع الفرق</span>
            </div>

            <h1 className="hero-title" ref={headlineRef}>
              <span className="hero-word-anim" style={{ display: 'inline-block' }}>بيتك&nbsp;</span>
              <span className="hero-word-anim" style={{ display: 'inline-block' }}>يستحق&nbsp;</span>
              <span className="hero-word-anim" style={{ display: 'inline-block' }}>تصميمًا&nbsp;</span>
              <span className="hero-word-anim" style={{ display: 'inline-block' }}><em>يشبهك</em>.</span>
            </h1>

            <p className="hero-description hero-desc-anim">
              اكتشف مجموعة من قطع الأثاث والديكور المصممة لتمنح مساحتك طابعًا خاصًا، حيث تلتقي الأناقة بالراحة، وتتحول التفاصيل البسيطة إلى تجربة مختلفة.
            </p>

            <div className="hero-actions">
              <Link to="/collections" className="btn btn-primary hero-cta-anim">
                <span>اكتشف مجموعتنا</span>
                <ArrowLeft size={16} />
              </Link>
              <Link to="/product/atelier-chair" className="btn btn-secondary hero-cta-anim">
                <Box size={16} />
                <span>استكشف الأثاث بتقنية 3D</span>
              </Link>
            </div>

            <div className="hero-subtext hero-sub-anim">
              تصميمات عصرية لمساحات تعبّر عنك.
            </div>
          </div>

          {/* Left Visual Card Showcase with Real Lifestyle Image & Floating 3D Badge */}
          <div className="hero-visual-card" ref={imageCardRef} style={{ position: 'relative' }}>
            <img
              src={assetUrl('images/hero-living.webp')}
              alt="مساحة معيشة معمارية فاخرة من ASAS"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.92) contrast(1.05)',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(23, 23, 21, 0.9) 0%, rgba(23, 23, 21, 0.2) 60%, rgba(23, 23, 21, 0.4) 100%)',
                zIndex: 1
              }}
            />

            {/* Floating 3D Badge */}
            <div
              className="hero-floating-badge"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 2,
                background: 'rgba(23, 23, 21, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--color-accent)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-accent)',
                fontSize: '0.82rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
            >
              <Sparkles size={14} />
              <span>مساحات معمارية حقيقية</span>
            </div>

            {/* Floating Bottom Card Banner */}
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(12px, 3vw, 24px)',
                right: 'clamp(12px, 3vw, 24px)',
                left: 'clamp(12px, 3vw, 24px)',
                zIndex: 2,
                background: 'rgba(32, 31, 27, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '2px' }}>
                  The Atelier Collection
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>
                  15 مجسم ثلاثي الأبعاد جاهز للمعاينة الفورية
                </p>
              </div>

              <Link to="/product/atelier-chair" className="btn btn-primary btn-sm">
                <span>تخصيص 3D</span>
                <Box size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
