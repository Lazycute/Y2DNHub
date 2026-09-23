import { useList } from '../lib/api.js';
import { ministries, pathways, pillars, seedEvents, seedStories } from '../data/seed.js';

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap narrow">
        <p className="label">About</p>
        <h2>More than a youth group.</h2>
        <p className="lead">
          We are a community of young people committed to following Jesus, growing together, serving
          others, and becoming everything God has called us to be. Not a program on a calendar. A
          family on a mission.
        </p>
      </div>
      <div id="mission" className="wrap grid three">
        {pillars.map((p) => (
          <div key={p.title} className="cell">
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Scripture({ quote, cite }) {
  return (
    <blockquote className="wrap narrow scripture">
      <p>“{quote}”</p>
      <cite>{cite}</cite>
    </blockquote>
  );
}

export function Ministries() {
  return (
    <section id="ministries" className="section">
      <div className="wrap">
        <p className="label">Ministries</p>
        <h2>Find your place to belong and grow.</h2>
        <ul className="rows">
          {ministries.map((m, i) => (
            <li key={m.title}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Stories() {
  const stories = useList('/stories', seedStories);
  return (
    <section id="stories" className="section">
      <div className="wrap">
        <p className="label">Stories</p>
        <h2>God is still writing stories.</h2>
        <div className="grid three">
          {stories.map((s) => (
            <figure key={s.id} className="cell story">
              <blockquote>“{s.quote}”</blockquote>
              <figcaption>{s.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const parts = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  };
};

export function Events() {
  const events = useList('/events', seedEvents);
  return (
    <section id="events" className="section">
      <div className="wrap">
        <p className="label">Events</p>
        <h2>Come as you are. Grow together.</h2>
        {events.length === 0 ? (
          <p className="muted">No upcoming events right now. Check back soon.</p>
        ) : (
          <ul className="rows events">
            {events.map((e) => {
              const { day, month } = parts(e.event_date);
              const meta = [e.time, e.location, e.details].filter(Boolean).join(' · ');
              return (
                <li key={e.id}>
                  <span className="date"><b>{day}</b>{month}</span>
                  <h3>{e.title}</h3>
                  <p>{meta}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export function Involve() {
  return (
    <section id="involved" className="section">
      <div className="wrap">
        <p className="label">Get involved</p>
        <h2>Ready to live with purpose?</h2>
        <div className="grid four">
          {pathways.map((p) => (
            <div key={p.title} className="cell">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
