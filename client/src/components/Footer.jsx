import { Link } from 'react-router-dom';
import { asset } from '../lib/nav.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <span className="brand static">
          <img src={asset('logo.png')} alt="" />
          <span>Youth to the Nations</span>
        </span>
        <span className="muted">Know Christ. Live with purpose. Make an impact.</span>
        <span className="muted">
          © {new Date().getFullYear()} Youth to the Nations · <Link to="/admin">Admin</Link>
        </span>
      </div>
    </footer>
  );
}
