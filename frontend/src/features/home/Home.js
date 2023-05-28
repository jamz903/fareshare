import { useSelector } from 'react-redux';
import RequireAuth from '../../components/RequireAuth';

function Home() {
    const username = useSelector(state => state.auth.username);

    return (
        <RequireAuth>
            <h1>Welcome back, {username}.</h1>
        </RequireAuth>
    );
}

export default Home;