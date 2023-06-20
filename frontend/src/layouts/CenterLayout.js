export default function CenterLayout({ children, className = '' }) {
    return (
        <div className={'w-full h-full flex flex-col items-center ' + className}>
            {children}
        </div>
    )
}