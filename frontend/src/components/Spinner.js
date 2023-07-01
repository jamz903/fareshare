export default function Spinner({ length = 6, spinnerColor = 'black', bgColor = 'white' }) {
    const str = [
        'inline-block',
        `w-${length}`,
        `h-${length}`,
        'border-2',
        'rounded-full',
        `border-l-${bgColor}`,
        `border-t-${bgColor}`,
        `border-r-${bgColor}`,
        `border-b-${spinnerColor}`,
        'animate-spin'
    ].join(' ');
    return (
        <span className={str}></span>
    )
}

export function LightSpinner() {
    return <Spinner spinnerColor="seasalt" bgColor="secondary" />
}

export function DarkSpinner() {
    return <Spinner spinnerColor="secondary" bgColor="seasalt" />
}