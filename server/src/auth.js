import { supabase } from './supabase.js';

const adminEmails = () =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export async function requireAdmin(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    if (!token) return res.status(401).json({ error: 'Sign in required' });

    const { data, error } = await supabase.auth.getUser(token);
    const email = data?.user?.email?.toLowerCase();
    if (error || !email) return res.status(401).json({ error: 'Invalid session' });
    if (!adminEmails().includes(email)) return res.status(403).json({ error: 'Not an admin' });

    req.user = data.user;
    next();
  } catch (err) {
    next(err);
  }
}
