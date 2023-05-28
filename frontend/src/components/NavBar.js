import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

function RenderLinks() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const authLinks = [{ 'name': 'Home', 'path': '/home' }];
    const guestLinks = [{ 'name': 'Login', 'path': '/login' }, { 'name': 'Register', 'path': '/register' }];
    const renderLinks = isAuthenticated ? authLinks : guestLinks;
    return (
        <Fragment>
            {renderLinks.map((link, index) => (
                <li key={index} className='nav-item'>
                    <NavLink className='nav-link' to={link.path}>{link.name}</NavLink>
                </li>
            ))}
            {isAuthenticated ? (
                <li key='logout' className='nav-item'>
                    <button className='nav-link btn btn-link' onClick={() => dispatch(logoutUser({}))}>Logout</button>
                </li>
            ) : null}
        </Fragment>
    );
}

export default function NavBar() {
    return (
        <div className='px-3 mb-3 navbar navbar-expand-sm navbar-light bg-light'>
            <NavLink className='navbar-brand' to='/home'>
                FareShare
            </NavLink>
            <div className='navbar-collapse'>
                <ul className='navbar-nav'>
                    <RenderLinks />
                </ul>
            </div>
        </div>
    );
}