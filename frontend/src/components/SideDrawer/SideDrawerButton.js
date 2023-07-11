export default function SideDrawerButton({ onClick = () => { }, children, disabled = false }) {
    return (
        <button className="text-primary text-left w-full hover:text-secondary" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}