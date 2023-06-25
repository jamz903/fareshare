import { useSelector } from 'react-redux';
import RequireAuth from '../../components/RequireAuth';
import NavBarLayout from '../../layouts/NavBarLayout';

function Home() {
    const username = useSelector(state => state.auth.username);

    return (
        <NavBarLayout navBarText='fareshare'>
            <h1>Welcome back, {username}.</h1>
        </NavBarLayout>
    );
}

export default Home;