import './assets/App.css';
// this is how we link to the backend django server
// we can use this to make requests to the backend, using axios.get() or axios.post()
import axios from "axios"; 
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header>
        {/* insert App logo and other introductory stuff */}
        <div className="App-header">
          FareShare
        </div>
      </header>
      <Outlet>
        {/* displays content in the child route */}
      </Outlet>
    </div>
  );
}

export default App;
