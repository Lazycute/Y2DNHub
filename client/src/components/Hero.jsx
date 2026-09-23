import { asset, go } from '../lib/nav.js';
import Arrow from './Arrow.jsx';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <img className="hero-bg" src={asset('hero.jpg')} alt="" />
      <div className="hero-glow" />
      <div className="hero-in">
        <div className="eyebrow">Youth to the Nations</div>
        <h1>Raising a Generation<br />That Knows <span className="script">Christ.</span></h1>
        <p className="hero-italic">Lives with purpose.</p>
        <p className="hero-desc">
          A Christ-centered youth ministry helping young people discover faith, identity, purpose,
          and community while learning to live boldly for Jesus.
        </p>
        <div className="row">
          <button className="pill grad" onClick={() => go('involved')}>Get Involved <Arrow /></button>
          <button className="pill ghost" onClick={() => go('mission')}>Explore the Ministry <Arrow /></button>
        </div>
      </div>
    </section>
  );
}
