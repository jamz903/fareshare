import './assets/App.css';
import { Outlet } from 'react-router-dom';

// this is how we link to the backend django server
// we can use this to make requests to the backend, using axios.get() or axios.post()
import axios from "axios";

// change baseURL to reflect the server's address
// all axios requests will then go here
axios.defaults.baseURL = "http://127.0.0.1:8000";

function App() {
  return (
    <div className="App">
      <header>
        {/* insert App logo and other introductory stuff */}
        <div className="App-header">
          FareShare
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
