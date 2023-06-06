import { Bars3Icon, CameraIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

function NavBar({ navBarText = 'fareshare' }) {
    return (
        <div className='rounded-2xl drop-shadow bg-seasalt py-3 px-4 flex flex-row gap-3 items-center text-primary'>
            <Bars3Icon className='h-6 w-6' />
            <div className='text-xl font-semibold truncate text-clip grow'>
                {navBarText}
            </div>
            <Link to="/camera">
                <CameraIcon className='h-6 w-6' />
            </Link>
            <Link to="/profile">
                <img className='rounded-full h-6 w-6' src="https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80"
                    alt="profile" />
            </Link>
        </div>
    );
}

export default NavBar;