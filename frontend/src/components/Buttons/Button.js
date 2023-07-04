import debounce from "./debounce";

export default function Button({ children, onClick = () => { }, type = 'button', className = '' }) {
    const debouncedOnClick = debounce(onClick);
    return (
        <button onClick={debouncedOnClick} type={type} className={"bg-secondary rounded-full py-3 px-12 text-seasalt drop-shadow min-w-[10rem] font-medium flex flex-col items-center " + className}>
            {children}
        </button>
    );
}