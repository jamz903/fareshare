import { Outlet } from 'react-router-dom';
import SideDrawer from './components/SideDrawer/SideDrawer';
import { checkAuthenticated } from './features/auth/authSlice';
import { useDispatch } from 'react-redux';

function App() {
  // check if user is authenticated
  const dispatch = useDispatch();
  dispatch(checkAuthenticated({}));
  return (
    <div className='h-full flex flex-row'>
      <SideDrawer />
      <div className='container mx-auto h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
