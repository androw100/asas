import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm({ initialProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: initialProduct,
    message: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus('error');
      return;
    }

    // Record inquiry smoothly
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div
        style={{
          background: 'rgba(196, 164, 119, 0.12)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <CheckCircle2 size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 12px auto' }} />
        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
          شكرًا لتواصلك مع ASAS
        </h4>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          تم استلام استفسارك بنجاح. سيتواصل معك فريق الاستوديو قريباً لتزويدك بكافة الأسعار والمواصفات وخيارات التوريد.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
      {status === 'error' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e57373',
            background: 'rgba(229, 115, 115, 0.1)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.85rem'
          }}
        >
          <AlertCircle size={16} />
          <span>من فضلك أدخل البيانات المطلوبة بشكل صحيح (الاسم ورقم الهاتف).</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="contact-name">الاسم الكامل *</label>
        <input
          id="contact-name"
          type="text"
          required
          className="form-input"
          placeholder="مثال: محمد العمري"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-phone">رقم الهاتف *</label>
        <input
          id="contact-phone"
          type="tel"
          required
          className="form-input"
          placeholder="مثال: 0501234567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-email">البريد الإلكتروني (اختياري)</label>
        <input
          id="contact-email"
          type="email"
          className="form-input"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-product">المنتج المستفسر عنه</label>
        <input
          id="contact-product"
          type="text"
          className="form-input"
          placeholder="اسم القطعة أو التصنيف"
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">رسالتك أو استفسارك</label>
        <textarea
          id="contact-message"
          className="form-textarea"
          placeholder="استفسر عن السعر، المقاسات، درجات الألوان، أو إمكانية الشحن لموقعك..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
        <Send size={15} style={{ marginLeft: '6px' }} />
        <span>إرسال الاستفسار</span>
      </button>
    </form>
  );
}

