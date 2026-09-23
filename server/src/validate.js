const TOPICS = [
  'General Inquiry',
  'Visiting an Event',
  'Joining a Ministry Team',
  'Missions & Outreach',
  'Prayer Request',
];

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function parseMessage(body = {}) {
  const topic = TOPICS.includes(body.topic) ? body.topic : 'General Inquiry';
  const value = {
    first_name: text(body.first_name, 80),
    last_name: text(body.last_name, 80),
    email: text(body.email, 200),
    phone: text(body.phone, 40) || null,
    topic,
    message: text(body.message, 2000),
    is_prayer: body.is_prayer === true || topic === 'Prayer Request',
  };

  if (!value.first_name || !value.last_name || !value.message) {
    return { error: 'Name and message are required' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    return { error: 'A valid email is required' };
  }
  return { value };
}
