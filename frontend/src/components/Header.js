export default function Header({ text = 'Header' }) {
    return (
        <div className="text-primary text-4xl font-bold">
            {text}
        </div>
    );
}