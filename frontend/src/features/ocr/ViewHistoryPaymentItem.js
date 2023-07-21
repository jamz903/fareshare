export default function ViewHistoryPaymentItem({ username = "", amount = 0.00 }) {
    const amountString = amount.toFixed(2);
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row w-[75%] justify-between items-center">
                <div className="overflow-clip text-ellipsis">
                    {username}
                </div>
                <div className="text-lg text-primary ml-2">
                    $
                </div>
            </div>
            <div className="text-lg text-primary ml-2">
                {amountString}
            </div>
        </div>
    )
}