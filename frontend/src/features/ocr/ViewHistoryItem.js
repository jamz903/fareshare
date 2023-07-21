import { ClipboardDocumentListIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function ViewHistoryItem({ receiptData, deleteReceipt = (id) => { }, showPayments = (id) => { } }) {
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
            deleteReceipt(id);
        }
    }

    const handleClick = (e) => {
        navigate('/receipt_data', { state: { id: receiptId } });
    }

    const handleShowPayments = (e) => {
        showPayments(receiptId);
    }

    return (
        <div className='w-full h-full flex flex-row drop-shadow'>
            <button key={receiptId}
                onClick={(e) => handleClick(receiptId)}
                className="w-full overflow-clip rounded-l-lg p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                <div className='text-start font-semibold break-words overflow-clip'>
                    {receiptName}
                </div>
                <div className='text-start font-light'>
                    Spent: ${myExpenses}
                </div>
            </button>
            <button key={`edit-${receiptId}`}
                onClick={(e) => handleClick(receiptId)}
                className="block rounded-none p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                <PencilIcon className="h-5 w-5 text-primary" />
            </button>
            <button key={`show-${receiptId}`}
                onClick={(e) => handleShowPayments(receiptId)}
                className="block rounded-none p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                <ClipboardDocumentListIcon className="h-5 w-5 text-primary" />
            </button>
            <button key={`delete-${receiptId}}`}
                onClick={(e) => { handleDelete(receiptId) }}
                className="block rounded-r-lg p-4 bg-seasalt border border-slate-200 cursor-pointer hover:border-primary active:drop-shadow-none">
                <TrashIcon className="h-5 w-5 text-red" />
            </button>
        </div>
    )
}