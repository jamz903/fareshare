import { Link } from 'react-router-dom';
import '../assets/About.css'

export default function About() {
  return (
    <div className="About-container">
      <div className="About-desc About-item">
        FareShare is a bill spllitting web app that helps students 
        automatically split bills and at the same time track their 
        expenditure in the most efficient and effortless way possible.
      </div>
      <Link className="About-item About-link" to="/Login">Register or Login</Link>
    </div>
  );
}