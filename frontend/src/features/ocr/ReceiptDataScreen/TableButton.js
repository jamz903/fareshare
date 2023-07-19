export default function TableButton({ className = '', onClick = () => { }, children }) {
    return (
        <button
            onClick={onClick}
            className={"border border-slate-400 rounded-md w-full font-light p-1 flex flex-row items-center gap-1 place-content-center " + className}>
            {children}
        </button>
    )
}