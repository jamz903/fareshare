// components
import TextareaAutoSize from "react-textarea-autosize";
import AssigneeBubble from "./AssigneeBubble";
// react
import { useState } from "react";
// lodash
import { difference } from "lodash"; // for difference between two arrays
// icons
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ReceiptDataRow({
    // receipt item fields
    name, // name of item
    price, // price of item
    quantity, // quantity of item
    assignees = [], // list of usernames of friends assigned to item, e.g. ['user1', 'user2']
    friends, // list of friends, e.g. [{username: 'user1', colorSet: 'bg-red-500'}, {username: 'user2', colorSet: 'bg-blue-500'}]
    // callbacks to update fields
    updateName = (newName) => { }, // callback to update name
    updatePrice = (newPrice) => { }, // callback to update price
    updateQuantity = (newQuantity) => { }, // callback to update quantity
    updateAssignees = (newAssignees) => { }, // callback to update assignees
    // assignee dropdown
    openAssigneeDropdown = () => { }, // callback to open assignee dropdown
    showAssigneeDropdown = false, // whether to show assignee dropdown
    // deletion
    deletionMode = false, // whether to show checkbox for deletion
    isChecked = false, // whether deletion checkbox is checked
    toggleChecked = () => { }, // callback to toggle deletion checkbox
}) {
    // compute friends not in assignees
    const nonAssignees = difference(friends.map(friend => friend.username), assignees).sort();

    const [nameFieldValue, setNameFieldValue] = useState(name);
    const [priceFieldValue, setPriceFieldValue] = useState(price);
    const [quantityFieldValue, setQuantityFieldValue] = useState(quantity);

    const addAssignee = (username) => {
        updateAssignees([...assignees, username]);
    }
    const removeAssignee = (username) => {
        updateAssignees(assignees.filter(u => u !== username));
    }

    return (
        <tr className="border-y border-slate-200">
            {
                deletionMode ?
                    <td className="p-1">
                        <input
                            type="checkbox"
                            className="w-full h-full"
                            defaultChecked={isChecked}
                            onChange={toggleChecked} />
                    </td> : null
            }
            <td className="p-1">
                <TextareaAutoSize
                    defaultValue={name}
                    placeholder="Enter item name"
                    onChange={e => updateName(e.target.value)}
                    onBlur={e => updateName(e.target.value)}
                    className="w-full bg-seasalt align-top" />
            </td>
            <td className="p-1">
                <input
                    type="number"
                    defaultValue={quantity}
                    onChange={e => updateQuantity(e.target.value)}
                    onBlur={e => updateQuantity(e.target.value)}
                    className="w-full bg-seasalt" />
            </td>
            <td className="p-1">
                <div className="flex flex-row gap-1">
                    <div>
                        $
                    </div>
                    <input
                        type="number"
                        defaultValue={price}
                        onChange={e => updatePrice(e.target.value)}
                        onBlur={e => updatePrice(e.target.value)}
                        className="w-full bg-seasalt" />
                </div>
            </td>
            <td className="p-1 relative" onClick={openAssigneeDropdown}>
                {showAssigneeDropdown ?
                    <div className="z-20 absolute top-0 right-0 w-40 flex flex-col gap-2 p-2 bg-seasalt rounded-lg w-4/12 drop-shadow">
                        <div className="flex flex-col p-1 gap-1">
                            <div className="text-xs font-light">
                                Assigned
                            </div>
                            {
                                assignees.map((username, index) => {
                                    return <AssigneeBubble
                                        key={`assignee-${index}`}
                                        friend={friends.find(f => f.username === username)}
                                        onClick={() => removeAssignee(username)}
                                        icon={<XMarkIcon className="w-4 h-4" />}
                                    />
                                })
                            }
                        </div>
                        <hr className="text-secondary" />
                        <div className="flex flex-col p-1 gap-1">
                            <div className="text-xs font-light">
                                Other Friends
                            </div>
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-40">
                                {nonAssignees
                                    .map((username, index) => {
                                        return <AssigneeBubble
                                            key={`friends-not-in-assignee-${index}`}
                                            friend={friends.find(f => f.username === username)}
                                            onClick={() => addAssignee(username)}
                                            icon={<PlusIcon className="w-4 h-4" />} />
                                    })}
                            </div>
                        </div>
                    </div>

                    : null}
                <div className="flex flex-col gap-1">
                    {assignees.map((username, index) => {
                        return <AssigneeBubble key={index} friend={friends.find(f => f.username === username)} />
                    })}
                </div>
            </td>
        </tr>
    )
}