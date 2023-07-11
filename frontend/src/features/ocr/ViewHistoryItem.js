import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";


export default function ViewHistoryItem({ receiptData, onDeleted = (id) => { } }) {
    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete this receipt?`)) {
            // delete receipt
            // callback
            onDeleted(id);
        }
    }


    const handleClick = (e) => {
        navigate("/receipt_data", { state: { id: e, receiptData: JSON.parse(JSON.parse(receiptData.processed_data)) } });
    }

    return (
        <div className='flex flex-row drop-shadow'>
            <button key={receiptData.id}
                onClick={(e) => handleClick(receiptData.id)}
                className="block w-full rounded-l-lg p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                <div className='text-start font-semibold'>
                    {receiptData.name}
                </div>
                <div className='text-start font-light'>
                    Spent: ${receiptData.my_expenses}
                </div>
            </button>
            <button key={`delete-${receiptData.id}`}
                onClick={(e) => { handleDelete(receiptData.id) }}
                className="block rounded-r-lg p-4 bg-seasalt border border-slate-200 cursor-pointer hover:border-primary active:drop-shadow-none">
                <div className='text-start font-semibold'>
                    <TrashIcon className="h-5 w-5 text-red" />
                </div>
            </button>
        </div>
    )
}