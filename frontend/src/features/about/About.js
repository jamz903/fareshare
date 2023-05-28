/**
 * Landing page for the app.
 */

import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div>
      <div className='p-1'>
        FareShare is a bill spllitting web app that helps students
        automatically split bills and at the same time track their
        expenditure in the most efficient and effortless way possible.
      </div>
      <div className='p-1'>
        <Link className="About-link" to="/login">Login</Link>
      </div>
      <div className='p-1'>
        <Link className="About-link" to="/register">New user? Register</Link>
      </div>
    </div>
  );
}