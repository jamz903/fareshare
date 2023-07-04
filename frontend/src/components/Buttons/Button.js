import { debounce } from "lodash";

export default function Button({ children, onClick = () => { }, type = 'button', className = '', disabled = false }) {
    const debouncedOnClick = debounce(onClick, 500);
    return (
        <button onClick={debouncedOnClick} disabled={disabled} type={type} className={"bg-secondary rounded-full py-3 px-12 text-seasalt drop-shadow min-w-[10rem] font-medium flex flex-col items-center " + className}>
            {children}
        </button>
    );
}