import { useEffect, useState } from 'react';
import { asset, go } from '../lib/nav.js';
import Arrow from './Arrow.jsx';

const links = [
  ['home', 'Home'],
  ['about', 'About'],
  ['mission', 'Mission'],
  ['events', 'Events'],
  ['ministries', 'Ministries'],
  ['stories', 'Stories'],
  ['involved', 'Get Involved'],
  ['connect', 'Contact'],
];

const domOrder = ['home', 'about', 'mission', 'ministries', 'stories', 'events', 'involved', 'connect'];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = 'home';
      for (const id of domOrder) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id) => {
    setOpen(false);
    go(id);
  };

  return (
    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <div className="nav-in">
        <button className="brand" onClick={() => jump('home')} aria-label="Youth to the Nations, back to top">
          <img src={asset('logo.png')} alt="" />
          <span className="brand-text">
            <span className="yt">Youth to the Nations</span>
            <span className="sub">We Are A Family</span>
          </span>
        </button>

        <nav className={open ? 'links open' : 'links'}>
          {links.map(([id, label]) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => jump(id)}>{label}</button>
          ))}
        </nav>

        <div className="nav-cta">
          <button className="pill outline" onClick={() => jump('involved')}>Get Involved <Arrow /></button>
          <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  );
}
