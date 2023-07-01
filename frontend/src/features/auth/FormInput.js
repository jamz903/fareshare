/**
 * Label and input component. This component allows for a label and input to be displayed together, with a success or error message if needed.
 * @param {string} label - Label for the input
 * @param {string} type - Type of the input
 * @param {string} name - Name of the input
 * @param {string} placeholder - Placeholder for the input
 * @param {string} defaultValue - Default value for the input
 * @param {function} onChange - Function to call when the input changes
 * @param {string} successMessage - Success message to show
 * @param {string} errorMessage - Error message to show
 * @param {string} status - Current status of the input (SUCCESS, ERROR, NONE)
 */

export default function FormInput({ label, type, name, placeholder, defaultValue = '', onChange = () => { }, successMessage, errorMessage, status }) {
    const [SUCCESS, ERROR, NONE] = ['SUCCESS', 'ERROR', 'NONE'];
    const borderColor =
        status === SUCCESS ? 'green' :
            status === ERROR ? 'red' :
                'primary';
    const shownMessage =
        status === SUCCESS ? successMessage :
            status === ERROR ? errorMessage :
                '';
    const shownMessageColor =
        status === SUCCESS ? 'green' :
            status === ERROR ? 'red' :
                'transparent';
    const ShownMessageComponent = () => {
        return (status === SUCCESS || status === ERROR) && shownMessage ? (
            <div className={`text-sm text-${shownMessageColor}`}>
                {shownMessage}
            </div>
        ) : null;
    }

    return (
        <label className="flex flex-col gap-1 w-full">
            <div className="w-full">
                {label}
            </div>
            <input
                type={type}
                name={name}
                className={`border-${borderColor} border-2 rounded-xl py-2 px-4 w-full`}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange} />
            <ShownMessageComponent />
        </label>
    )
}