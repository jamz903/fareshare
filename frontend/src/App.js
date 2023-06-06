import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Fragment>
      <div className='container mx-auto p-5'>
        <Outlet />
      </div>
    </Fragment>
  );
}

export default App;
