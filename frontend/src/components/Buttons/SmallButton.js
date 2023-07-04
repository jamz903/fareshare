import { debounce } from "lodash";

export default function SmallButton({ children, onClick = () => { }, type = 'button', className = '', bgColor = 'secondary', textColor = 'seasalt', borderColor = 'transparent' }) {
    const debouncedOnClick = debounce(onClick, 500);
    return (
        <button onClick={debouncedOnClick} type={type} className={`rounded-full p-2 drop-shadow font-medium text-sm text-${textColor} bg-${bgColor} border border-${borderColor} ${className}`}>
            {children}
        </button>
    );
}