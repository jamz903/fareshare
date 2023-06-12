import { Outlet } from 'react-router-dom';
import SideDrawer from './components/SideDrawer/SideDrawer';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
      <div className='h-full flex flex-row'>
        <SideDrawer />
        <div className='container mx-auto p-5'>
          <Outlet />
        </div>
      </div>
  );
}

export default App;
