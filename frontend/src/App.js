import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import NavBar from './components/NavBar';

function App() {
  return (
    <Fragment>
      <NavBar />
      <div className="container">
        <Outlet />
      </div>
    </Fragment>
  );
}

export default App;
