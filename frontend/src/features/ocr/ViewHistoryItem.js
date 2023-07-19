import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";


export default function ViewHistoryItem({ receiptData, onDeleted = (id) => { } }) {
    const navigate = useNavigate();
    const receiptId = receiptData.id;
    const receiptName = receiptData.name ? receiptData.name : `Receipt ${receiptId}`;
    const myExpenses = receiptData.my_expenses ? receiptData.my_expenses : 0;

    if (!receiptData || !receiptData.id) {
        // cannot be null!
        console.error('receiptData or receiptId is null!')
        return null;
    }

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete this receipt?`)) {
            // delete receipt
            // callback
            onDeleted(id);
        }
    }

    const handleClick = (e) => {
        navigate('/receipt_data', { state: { id: receiptId } });
    }

    return (
        <div className='w-full flex flex-row drop-shadow'>
            <button key={receiptId}
                onClick={(e) => handleClick(receiptId)}
                className="block grow rounded-l-lg p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                <div className='w-full text-start font-semibold break-words'>
                    {receiptName}
                </div>
                <div className='text-start font-light'>
                    Spent: ${myExpenses}
                </div>
            </button>
            <button key={`delete-${receiptId}}`}
                onClick={(e) => { handleDelete(receiptId) }}
                className="block rounded-r-lg p-4 bg-seasalt border border-slate-200 cursor-pointer hover:border-primary active:drop-shadow-none">
                <div className='text-start font-semibold'>
                    <TrashIcon className="h-5 w-5 text-red" />
                </div>
            </button>
        </div>
    )
}