/** Override Link component to standardise styling */
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ to, children }) {
    return (
        <RouterLink role="link" className="text-primary underline" to={to}>{children}</RouterLink>
    );
}