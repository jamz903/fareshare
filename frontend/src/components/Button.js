export default function Button({ text = 'Button', onClick = () => { }, type = 'button' }) {
    return (
        <button onClick={onClick} type={type} className="bg-secondary rounded-full py-3 px-12 text-seasalt drop-shadow min-w-[10rem] font-medium">
            {text}
        </button>
    );
}