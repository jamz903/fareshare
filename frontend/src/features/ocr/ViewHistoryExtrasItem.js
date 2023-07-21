/**
 * for displaying GST, Tax and Discounts in the View History Modal
 */

export default function ViewHistoryExtrasItem({ name = "", amount = 0.00 }) {
    const amountString = amount.toFixed(2);
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row w-[75%] justify-between items-center">
                <div className="overflow-clip text-ellipsis font-light">
                    {name}
                </div>
                <div className="text-lg text-secondary ml-2">
                    $
                </div>
            </div>
            <div className="text-lg text-secondary ml-2">
                {amountString}
            </div>
        </div>
    )
}