import logo from './logo.svg';
import './App.css';
// this is how we link to the backend django server
// we can use this to make requests to the backend, using axios.get() or axios.post()
import axios from "axios"; 
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Outlet>
          
        </Outlet>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
