export default function Spinner({ length = 6, spinnerColor = 'black', bgColor = 'white', className = '' }) {
    const str = [
        `w-${length}`,
        `h-${length}`,
        'border-2',
        'rounded-full',
        `border-l-${bgColor}`,
        `border-t-${bgColor}`,
        `border-r-${bgColor}`,
        `border-b-${spinnerColor}`,
        'animate-spin',
        className
    ].join(' ');
    return (
        <div className={str}></div>
    )
}

export function LightSpinner({ length = 6, className = '' }) {
    return <Spinner spinnerColor="seasalt" bgColor="secondary" length={length} className={className} />
}

export function DarkSpinner({ length = 6, className = '' }) {
    return <Spinner spinnerColor="secondary" bgColor="seasalt" length={length} className={className} />
}