import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Box, Compass, Sparkles, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ContactForm from '../components/ContactForm';
import FAQSection from '../components/FAQSection';
import { products } from '../data/products';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { assetUrl } from '../utils/assetUrl';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const philosophyRef = useRef(null);
  const featuredRef = useRef(null);
  const aboutRef = useRef(null);
  const showcaseRef = useRef(null);
  const contactRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const featuredProducts = products.filter((p) => p.featured);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Categories Stagger
      gsap.fromTo(
        '.category-card-anim',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.categories-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.philosophy-content',
        { y: 35, opacity: 0, filter: 'blur(4px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: philosophyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.showcase-box',
        { scale: 0.97, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.about-image-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.about-text-content',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.contact-anim-box',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. قسم التصنيفات — Explore Collections */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-2xl) auto' }}>
            <span className="badge" style={{ marginBottom: '12px' }}>التصنيفات</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 600, marginBottom: '16px' }}>
              اكتشف عالم ASAS
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.8' }}>
              لكل مساحة احتياجاتها، ولكل ذوق اختياراته. استكشف مجموعاتنا واختر القطع التي تكمل رؤيتك لمنزلك.
            </p>
          </div>

          <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-lg)' }}>
            <Link
              to="/collections?category=كراسي ومقاعد"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              className="category-card-anim"
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>01</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600 }}>كراسي ومقاعد</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                تصاميم خشبية منحوتة وكراسي طعام ومكاتب مريحة تدعم مساحتك بالأناقة اليومية (9 موديلات 3D).
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>تصفح كراسي الجلوس</span>
                <ArrowLeft size={15} />
              </div>
            </Link>

            <Link
              to="/collections?category=طاولات"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              className="category-card-anim"
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>02</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600 }}>طاولات طعام معمارية</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                طاولات مستطيلة ودائرية بألواح البلوط والرخام والزجاج المقسى (6 موديلات 3D).
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>تصفح الطاولات</span>
                <ArrowLeft size={15} />
              </div>
            </Link>

            <Link
              to="/product/atelier-chair"
              style={{
                background: 'linear-gradient(135deg, #24221d 0%, #171715 100%)',
                border: '1px solid var(--color-border-active)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              className="category-card-anim"
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>03</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
                استوديو 3D المخصص
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                اختر أي قطعة، وبدل بين درجات الأخشاب والأقمشة واختبر مظهرها من كل زاوية.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>بدء تجربة التخصيص 3D</span>
                <ArrowLeft size={15} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. قسم المنتجات المميزة — Featured Pieces */}
      <section className="section" ref={featuredRef} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <span className="badge" style={{ marginBottom: '8px' }}>مختارات مميزة</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 600 }}>
                قطع تستحق أن تكون في منزلك.
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '6px' }}>
                مجموعة مختارة من التصميمات التي تجمع بين المظهر الأنيق والتفاصيل المدروسة، لتمنح كل ركن من منزلك حضورًا خاصًا.
              </p>
            </div>
            <Link to="/collections" className="btn btn-outline btn-sm">
              <span>استكشف كل المنتجات</span>
              <ArrowLeft size={14} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* 4. قسم تجربة 3D */}
      <section className="section" ref={showcaseRef} style={{ background: 'radial-gradient(circle at 60% 40%, rgba(196, 164, 119, 0.1) 0%, #191815 100%)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="showcase-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ marginBottom: '16px' }}>
                <Box size={14} style={{ marginLeft: '4px' }} />
                تجربة تفاعلية حية
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 600, lineHeight: 1.25, marginBottom: '20px' }}>
                مش مجرد صورة… اكتشف كل تفصيلة.
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.85', marginBottom: '28px' }}>
                شاهد قطع الأثاث بتقنية ثلاثية الأبعاد، ودوّر القطعة من كل زاوية، وقرّب التفاصيل، وجرّب الألوان والخامات المتاحة لتتصور شكلها قبل اتخاذ قرارك.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/product/atelier-chair" className="btn btn-primary">
                  <Compass size={16} />
                  <span>ابدأ تجربة 3D</span>
                </Link>
                <Link to="/collections" className="btn btn-secondary">
                  <span>اكتشف المنتجات</span>
                </Link>
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-xl)', textAlign: 'center', boxShadow: 'var(--shadow-elevated)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(196,164,119,0.12)', border: '1px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--color-accent)' }}>
                <Box size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                تحكم كامل 360 درجة
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.7', maxWidth: '380px', margin: '0 auto 20px auto' }}>
                تدوير بحرية باللمس أو الماوس، زوايا كاميرا محددة مسبقاً (واجهة، جانب، منظور علوي)، وتطبيق فوري للألوان والخامات.
              </p>
              <Link to="/product/oak-concrete-dining-table" className="btn btn-outline btn-sm">
                معاينة طاولة الطعام الكبيرة في 3D
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. قسم فلسفة التصميم — Our Philosophy */}
      <section id="philosophy" className="section" ref={philosophyRef} style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="philosophy-content" style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge" style={{ marginBottom: '16px' }}>فلسفة التصميم</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 600, lineHeight: 1.25, marginBottom: '20px' }}>
              التصميم الجميل يبدأ من التفاصيل.
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', color: 'var(--color-text-muted)' }}>
              في ASAS، نرى أن جمال الأثاث لا يتوقف عند شكله الخارجي؛ بل يمتد إلى تناسق الألوان، واختيار الخامات، وتوازن التفاصيل، وكيفية انسجام القطعة مع المساحة المحيطة بها. هدفنا أن نساعدك في اختيار قطع تضيف لمنزلك جمالًا وشخصية.
            </p>
          </div>
        </div>
      </section>

      {/* 6. قسم من نحن مع صورة الحرفية الراقية — About ASAS */}
      <section id="about" className="section" ref={aboutRef} style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
            {/* Image Card Showcase */}
            <div className="about-image-card" style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--color-border)', aspectRatio: '4/3', width: '100%' }}>
              <img
                src={assetUrl('images/about-craft.webp')}
                alt="حرفية التصميم والأخشاب الطبيعية لدى ASAS"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23, 23, 21, 0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', left: '20px', color: '#fff' }}>
                <span className="badge" style={{ background: 'rgba(23,23,21,0.85)', borderColor: 'var(--color-accent)' }}>
                  حرفية أصيلة
                </span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '8px', fontWeight: 600 }}>
                  توازن دقيق بين التقنية الرقمية ودفء الطبيعة
                </h4>
              </div>
            </div>

            {/* About Text Content */}
            <div className="about-text-content" style={{ width: '100%' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>من نحن</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', fontWeight: 600, marginBottom: '16px' }}>
                نؤمن أن لكل بيت شخصية.
              </h2>
              <p style={{ fontSize: '1.02rem', lineHeight: '1.9', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                في ASAS، ننظر إلى الأثاث باعتباره جزءًا أساسيًا من تجربة الحياة داخل المنزل. لذلك نهتم بالتصميمات التي تجمع بين الأناقة والعملية، وبالتفاصيل التي تساعد كل قطعة على الانسجام مع المساحة المحيطة بها.
                <br /><br />
                نسعى إلى تقديم تجربة اختيار أكثر وضوحًا وسهولة، تتيح لك اكتشاف التصميمات، والتعرف على مواصفاتها، واستكشاف مظهرها ثلاثي الأبعاد قبل التواصل معنا.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 'var(--space-md)' }}>
                <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)' }}>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                    رؤيتنا
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                    أن نجعل اختيار الأثاث تجربة أكثر إلهامًا ووضوحًا، تساعد كل عميل على التعبير عن ذوقه.
                  </p>
                </div>

                <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)' }}>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                    مهمتنا
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                    تقديم تجربة رقمية تجمع بين التصميم الراقي وأدوات تفاعلية لاكتشاف الخيارات.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. الأسئلة الشائعة — FAQ */}
      <FAQSection />

      {/* 8. قسم التواصل — Contact Us */}
      <section id="contact" className="section" ref={contactRef} style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-3xl)', alignItems: 'start' }}>
            <div className="contact-anim-box">
              <span className="badge" style={{ marginBottom: '16px' }}>
                <MessageSquare size={13} style={{ marginLeft: '4px' }} />
                تواصل معنا
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', fontWeight: 600, marginBottom: '16px' }}>
                يسعدنا أن نساعدك في اختيارك.
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.85', marginBottom: '24px' }}>
                لديك سؤال عن أحد منتجاتنا أو تحتاج إلى معرفة الأسعار والمقاسات والخيارات المتاحة؟ تواصل معنا وسنساعدك في الحصول على التفاصيل.
              </p>
              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>
                  البريد الرسمي للاستوديو:
                  <br />
                  <strong style={{ color: 'var(--color-accent)', direction: 'ltr', display: 'inline-block', marginTop: '4px' }}>studio@asas-living.com</strong>
                </p>
              </div>
            </div>

            <div className="contact-anim-box" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-xl)' }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 9. قسم الدعوة لاتخاذ إجراء — CTA */}
      <section className="section">
        <div className="container">
          <div
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(196, 164, 119, 0.15) 0%, #1f1e1a 100%)',
              border: '1px solid var(--color-border-active)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(2.5rem, 5vw, 4.5rem)',
              textAlign: 'center',
              maxWidth: '960px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', marginBottom: '16px', fontWeight: 600 }}>
              ابدأ بتصميم المساحة التي تحبها.
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto 28px auto', color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              تصفّح مجموعتنا، واكتشف التصميمات، وجرّب الاختيارات المتاحة لتقترب أكثر من الشكل الذي تتخيله لمنزلك.
            </p>
            <Link to="/collections" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              <span>اكتشف مجموعتنا</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
