import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { supabase } from './supabase.js';
import { requireAdmin } from './auth.js';
import { crud } from './crud.js';
import { parseMessage } from './validate.js';

const app = express();
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json({ limit: '20kb' }));

const needDb = (req, res, next) =>
  supabase ? next() : res.status(503).json({ error: 'Database not configured' });

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

app.get('/api/health', (req, res) => res.json({ ok: true, db: Boolean(supabase) }));

app.get('/api/events', needDb, wrap(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from('events').select('*').gte('event_date', today).order('event_date');
  if (error) throw error;
  res.json(data);
}));

app.get('/api/stories', needDb, wrap(async (req, res) => {
  const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data);
}));

const messageLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });

app.post('/api/messages', messageLimiter, needDb, wrap(async (req, res) => {
  const { value, error: invalid } = parseMessage(req.body);
  if (invalid) return res.status(400).json({ error: invalid });
  const { error } = await supabase.from('messages').insert(value);
  if (error) throw error;
  res.status(201).json({ ok: true });
}));

const admin = express.Router();
admin.use(needDb, requireAdmin);
admin.get('/me', (req, res) => res.json({ email: req.user.email }));
admin.use('/events', crud('events', ['title', 'event_date', 'time', 'location', 'details'], { order: 'event_date' }));
admin.use('/stories', crud('stories', ['name', 'quote'], { order: 'created_at', ascending: false }));
admin.use('/messages', crud('messages', ['handled'], { order: 'created_at', ascending: false, create: false }));
app.use('/api/admin', admin);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.code ? 400 : 500).json({ error: err.message || 'Request failed' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
