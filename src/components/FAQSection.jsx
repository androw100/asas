import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { faqs } from '../data/products';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto var(--space-2xl) auto' }}>
          <span className="badge" style={{ marginBottom: '12px' }}>
            <HelpCircle size={13} style={{ marginLeft: '4px' }} />
            الأسئلة الشائعة
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 600, marginBottom: '12px' }}>
            كل ما يهمك معرفته عن تجربة ASAS
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            إجابات واضحة ومباشرة حول عارض 3D، وتخصيص الخامات، واستفسارات الأسعار والمقاسات.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleIndex(i)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={18} style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

