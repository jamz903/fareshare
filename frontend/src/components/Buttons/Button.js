export default function Button({ children, onClick = () => { }, type = 'button', className = '', disabled = false }) {
    return (
        <button onClick={onClick} disabled={disabled} type={type} className={"bg-secondary rounded-full py-3 px-12 text-seasalt drop-shadow min-w-[10rem] font-medium flex flex-col items-center " + className}>
            {children}
        </button>
    );
}