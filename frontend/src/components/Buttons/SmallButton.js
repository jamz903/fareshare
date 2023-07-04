export default function SmallButton({ children, onClick = () => { }, type = 'button', className = '', bgColor = 'secondary', textColor = 'seasalt', borderColor = 'transparent', disabled = false }) {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`rounded-full p-2 drop-shadow font-medium text-sm text-${textColor} bg-${bgColor} border border-${borderColor} ${className}`}
            disabled={disabled}>
            {children}
        </button>
    );
}