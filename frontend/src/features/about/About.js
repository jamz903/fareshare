/**
 * Landing page for the app.
 */

import { Link } from 'react-router-dom';
import '../../assets/About.css';

export default function About() {
  return (
    <div className="body-content-container column">
      <div className="About-desc About-item">
        FareShare is a bill spllitting web app that helps students
        automatically split bills and at the same time track their
        expenditure in the most efficient and effortless way possible.
      </div>
      <Link className="About-item About-link" to="/login">Login</Link>
      <Link className="About-item About-link" to="/register">New user? Register</Link>
    </div>
  );
}