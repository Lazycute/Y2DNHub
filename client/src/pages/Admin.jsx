import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { api } from '../lib/api.js';

const eventFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'event_date', label: 'Date', type: 'date', required: true },
  { name: 'time', label: 'Time' },
  { name: 'location', label: 'Location' },
  { name: 'details', label: 'Details' },
];

const storyFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'quote', label: 'Quote', type: 'textarea', required: true },
];

function useAdmin(path, token) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const load = useCallback(
    () => api(`/admin/${path}`, { token }).then(setRows).catch((e) => setError(e.message)),
    [path, token]
  );
  useEffect(() => { load(); }, [load]);
  return { rows, error, setError, load };
}

function Shell({ children, onSignOut }) {
  return (
    <div className="admin">
      <header className="wrap admin-bar">
        <Link to="/">← Site</Link>
        <strong>Admin</strong>
        {onSignOut ? <button className="link" onClick={onSignOut}>Sign out</button> : <span />}
      </header>
      <div className="wrap">{children}</div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
  };

  return (
    <form className="login" onSubmit={submit}>
      <h2>Sign in</h2>
      <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary">Sign in</button>
    </form>
  );
}

function Messages({ token }) {
  const { rows, error, setError, load } = useAdmin('messages', token);
  const act = (fn) => fn().then(load).catch((e) => setError(e.message));

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && <p className="muted">No messages yet.</p>}
      <ul className="list">
        {rows.map((m) => (
          <li key={m.id} className={m.handled ? 'handled' : ''}>
            <div>
              <strong>{m.first_name} {m.last_name}</strong> {m.is_prayer && <span className="tag">Prayer</span>}
              <div className="muted">
                {m.email}{m.phone ? ` · ${m.phone}` : ''} · {m.topic} · {new Date(m.created_at).toLocaleString()}
              </div>
              <p>{m.message}</p>
            </div>
            <div className="actions">
              <button className="link" onClick={() => act(() => api(`/admin/messages/${m.id}`, { method: 'PUT', token, body: { handled: !m.handled } }))}>
                {m.handled ? 'Reopen' : 'Mark handled'}
              </button>
              <button className="link danger" onClick={() => window.confirm('Delete this message?') && act(() => api(`/admin/messages/${m.id}`, { method: 'DELETE', token }))}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Collection({ path, token, fields, title, subtitle }) {
  const { rows, error, setError, load } = useAdmin(path, token);
  const [draft, setDraft] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    try {
      const body = Object.fromEntries(fields.map((f) => [f.name, draft[f.name] === '' ? null : draft[f.name]]));
      await api(draft.id ? `/admin/${path}/${draft.id}` : `/admin/${path}`, {
        method: draft.id ? 'PUT' : 'POST',
        token,
        body,
      });
      setDraft(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = (row) => {
    if (!window.confirm('Delete this item?')) return;
    api(`/admin/${path}/${row.id}`, { method: 'DELETE', token }).then(load).catch((e) => setError(e.message));
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {draft ? (
        <form className="editor" onSubmit={save}>
          {fields.map((f) => (
            <label key={f.name}>{f.label}
              {f.type === 'textarea' ? (
                <textarea rows="3" required={f.required} value={draft[f.name] ?? ''} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} />
              ) : (
                <input type={f.type || 'text'} required={f.required} value={draft[f.name] ?? ''} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} />
              )}
            </label>
          ))}
          <div className="row">
            <button className="btn primary">Save</button>
            <button type="button" className="btn" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="btn primary" onClick={() => setDraft(Object.fromEntries(fields.map((f) => [f.name, ''])))}>Add</button>
      )}
      <ul className="list">
        {rows.map((row) => (
          <li key={row.id}>
            <div><strong>{title(row)}</strong><div className="muted">{subtitle(row)}</div></div>
            <div className="actions">
              <button className="link" onClick={() => setDraft(row)}>Edit</button>
              <button className="link danger" onClick={() => remove(row)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dashboard({ token }) {
  const [tab, setTab] = useState('messages');
  const [access, setAccess] = useState('checking');

  useEffect(() => {
    api('/admin/me', { token }).then(() => setAccess('ok')).catch((e) => setAccess(e.message));
  }, [token]);

  if (access === 'checking') return <p className="muted">Checking access…</p>;
  if (access !== 'ok') return <p className="error">{access}</p>;

  return (
    <>
      <div className="tabs">
        {['messages', 'events', 'stories'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'messages' && <Messages token={token} />}
      {tab === 'events' && (
        <Collection path="events" token={token} fields={eventFields} title={(r) => r.title}
          subtitle={(r) => [r.event_date, r.time, r.location, r.details].filter(Boolean).join(' · ')} />
      )}
      {tab === 'stories' && (
        <Collection path="stories" token={token} fields={storyFields} title={(r) => r.name} subtitle={(r) => r.quote} />
      )}
    </>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) { setSession(null); return undefined; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!supabase) {
    return <Shell><p className="muted">Supabase isn’t configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env.</p></Shell>;
  }
  if (!session) return <Shell><Login /></Shell>;
  return <Shell onSignOut={() => supabase.auth.signOut()}><Dashboard token={session.access_token} /></Shell>;
}
