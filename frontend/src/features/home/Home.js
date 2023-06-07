import { useSelector } from 'react-redux';
import RequireAuth from '../../components/RequireAuth';
import NavBar from '../../components/NavBar';

function Home() {
    const username = useSelector(state => state.auth.username);

    return (
        <RequireAuth>
            <NavBar text="Home" />
            <h1>Welcome back, {username}.</h1>
        </RequireAuth>
    );
}

export default Home;