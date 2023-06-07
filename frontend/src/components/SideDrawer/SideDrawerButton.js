export default function SideDrawerButton({ onClick = () => { }, children }) {
    return (
        <button className="text-primary text-left w-full hover:text-secondary" onClick={onClick}>{children}</button>
    );
}