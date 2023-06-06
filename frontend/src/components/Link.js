/** Override Link component to standardise styling */
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ to, children }) {
    return (
        <RouterLink className="text-primary underline" to={to}>{children}</RouterLink>
    );
}