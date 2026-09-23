import { useState } from 'react';
import { api } from '../lib/api.js';
import { topics } from '../data/seed.js';

const empty = { first_name: '', last_name: '', email: '', phone: '', topic: topics[0], message: '', is_prayer: false };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'topic' && value === 'Prayer Request' ? { is_prayer: true } : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api('/messages', { method: 'POST', body: form });
      setStatus('done');
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'We couldn’t reach the server. Please email us instead.' : err.message);
      setStatus('idle');
    }
  };

  return (
    <section id="connect" className="section">
      <div className="wrap contact">
        <div>
          <p className="label">Contact</p>
          <h2>Let’s start the conversation.</h2>
          <p className="lead">
            Whether you want to visit an event, need prayer, or want to get plugged in, we’d love to
            hear from you.
          </p>
          <dl className="details">
            <dt>Visit</dt><dd>123 Freedom Avenue, Your City</dd>
            <dt>Email</dt><dd>hello@youthtothenations.org</dd>
            <dt>Call / Text</dt><dd>(555) 010-2024</dd>
          </dl>
        </div>

        {status === 'done' ? (
          <div className="done">
            <h3>Message received.</h3>
            <p>Thank you for reaching out. Someone from our family will connect with you soon.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="two">
              <label>First name<input required value={form.first_name} onChange={set('first_name')} /></label>
              <label>Last name<input required value={form.last_name} onChange={set('last_name')} /></label>
            </div>
            <div className="two">
              <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
              <label>Phone (optional)<input type="tel" value={form.phone} onChange={set('phone')} /></label>
            </div>
            <label>I’m reaching out about
              <select value={form.topic} onChange={set('topic')}>
                {topics.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Message<textarea required rows="4" value={form.message} onChange={set('message')} /></label>
            <label className="check">
              <input type="checkbox" checked={form.is_prayer} onChange={set('is_prayer')} />
              This is a prayer request
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
