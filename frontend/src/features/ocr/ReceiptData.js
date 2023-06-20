import NavBarLayout from "../../layouts/NavBarLayout";
import { ShoppingCartIcon, CurrencyDollarIcon, HashtagIcon, UserIcon, XMarkIcon, PlusIcon, HeartIcon, BanknotesIcon, ReceiptPercentIcon } from "@heroicons/react/24/outline";
import TextareaAutoSize from "react-textarea-autosize";
import { useState, useRef } from "react";
import { PAYMENTMETHOD } from "./ReceiptJsonParser";
import Button from "../../components/Button";
// router
import { useLocation } from "react-router-dom";

const TAX_RATE = 0.08;
const SVC_RATE = 0.1;

const COLOR_SETS = [
    "bg-[#C6C5FA] text-black",
    "bg-[#C5FADD] text-black",
    "bg-[#C5E7FA] text-black",
    "bg-[#EFC5FA] text-black",
    "bg-[#FAC5C5] text-black",
    "bg-[#FAEBC5] text-black",
]

const obtainRandomColorSet = () => {
    return COLOR_SETS[Math.floor(Math.random() * COLOR_SETS.length)];
}

// FRIENDS list, to be obtained from server
const FRIENDS = [
    {
        name: "chihuahuasdad",
    },
    {
        name: "notbingsu",
    },
    {
        name: "darielwilbert",
    },
    {
        name: "bigbraintoh",
    },
    {
        name: "yukuleles",
    },
    {
        name: "annxbelle"
    },
].sort((a, b) => a.name.localeCompare(b.name)); // sort friend list

// give everyone a color
FRIENDS.forEach((friend, index) => {
    friend.colorSet = obtainRandomColorSet();
});

function AssigneeBubble({ friendIndex, onClick = () => { }, icon = null }) {
    const colorSet = FRIENDS[friendIndex].colorSet;
    const friend = FRIENDS[friendIndex];
    return (
        <div className={`flex flex-row p-1 px-3 items-center place-content-between rounded-full ${colorSet}`} onClick={onClick}>
            <div className="text-ellipsis overflow-hidden">
                {friend.name}
            </div>
            {icon ?
                <div className="w-4">
                    {icon}
                </div> : null
            }
        </div>
    )
}

export default function ReceiptData() {

    const location = useLocation();
    let { receiptData } = location.state ? location.state : {};

    // dummy receipt data
    if (!receiptData) {
        receiptData = {
            items: [
                {
                    "name": "Coke Light 20x Extra Small",
                    "price": null,
                    "qty": 1,
                    "assigneesIndexes": [0]
                },
                {
                    "name": "Pepsi",
                    "price": 1.99,
                    "qty": 1,
                    "assigneesIndexes": [1, 2]
                },
                {
                    "name": "Sprite",
                    "price": 1.99,
                    "qty": 1,
                    "assigneesIndexes": null
                },
                {
                    "name": "Double Cheeseburger Set Meal",
                    "price": 5.99,
                    "qty": 3,
                    "assigneesIndexes": [0, 1, 2]
                },
                {
                    "name": "Teh O Ice Limau",
                    "price": 3.50,
                    "qty": 3,
                    "assigneesIndexes": [3, 4, 5]
                }
            ],
            other: {
                subTotal: 0,
                total: 0,
                tax: 0,
                serviceCharge: 0,
                discount: 0,
                paymentMethod: PAYMENTMETHOD.CASH,
                paidAmount: 0,
                change: 0,
            }
        }
    }

    const [items, setItems] = useState(receiptData.items);
    const [tax, setTax] = useState(receiptData.other.tax);
    const [serviceCharge, setServiceCharge] = useState(receiptData.other.serviceCharge);
    const priceTax = useRef(tax);
    const priceServiceCharge = useRef(serviceCharge);
    const [discount, setDiscount] = useState(receiptData.other.discount);
    const [taxExcluded, setTaxExcluded] = useState(true);
    const [svcExcluded, setSvcExcluded] = useState(true);
    const [discountExcluded, setDiscountExcluded] = useState(true);
    const calculateExclusionText = () => {
        const textArr = [];
        if (taxExcluded) {
            textArr.push("Tax");
        }
        if (svcExcluded) {
            textArr.push("Service Charge");
        }
        if (discountExcluded) {
            textArr.push("Discount");
        }
        if (textArr.length === 0) {
            return "";
        } else if (textArr.length === 1) {
            return textArr[0] + " is not included in this total.";
        } else {
            return textArr.slice(0, -1).join(", ") + " and " + textArr.slice(-1)[0] + " are not included in this total.";
        }
    }
    const exclusionText = calculateExclusionText();

    // Component for each item row
    function ReceiptDataRow({ name, price, quantity, assigneesIndexes, dataRowIndex }) {

        if (!assigneesIndexes) {
            assigneesIndexes = [];
        }

        if (assigneesIndexes) {
            assigneesIndexes = assigneesIndexes.sort();
        }

        const [m_name, setName] = useState(name);
        const [m_price, setPrice] = useState(price);
        const [m_quantity, setQuantity] = useState(quantity);

        // compute friendIndexes not in assigneesIndexes
        const nonAssigneesIndexes = FRIENDS.map((friend, index) => {
            if (!assigneesIndexes.includes(index)) {
                return index;
            } else {
                return -1;
            }
        }).filter(index => index !== -1).sort();

        const addAssigneeIndex = (index) => {
            changeItemAssignees([...assigneesIndexes, index], dataRowIndex);
        }
        const removeAssigneeIndex = (index) => {
            changeItemAssignees(assigneesIndexes.filter(i => i !== index), dataRowIndex);
        }

        // for dropdown menu
        // parent keeps track of which dropdown is open. so when the parent re-renders, the appropriate dropdown will open/stay open.
        const showAssigneeDropdown = dataRowIndexDropdownOpen === dataRowIndex;
        const openAssigneeDropdown = () => {
            setDataRowIndexDropdownOpen(dataRowIndex);
        }

        return (
            <tr className="border-y border-slate-300">
                <td className="p-1">
                    <TextareaAutoSize
                        key={`textarea-${dataRowIndex}`}
                        defaultValue={m_name}
                        onChange={e => setName(e.target.value)}
                        onBlur={e => changeItemName(e.target.value, dataRowIndex)}
                        className="w-full bg-seasalt align-top" />
                </td>
                <td className="p-1">
                    <input
                        key={`quantity-${dataRowIndex}`}
                        type="number"
                        defaultValue={m_quantity}
                        onChange={e => setQuantity(e.target.value)}
                        onBlur={e => changeItemQuantity(e.target.value, dataRowIndex)}
                        className="w-full bg-seasalt" />
                </td>
                <td className="p-1">
                    <div className="flex flex-row gap-1">
                        <div>
                            $
                        </div>
                        <input
                            key={`price-${dataRowIndex}`}
                            type="number"
                            defaultValue={m_price}
                            onChange={e => setPrice(e.target.value)}
                            onBlur={e => changeItemPrice(e.target.value, dataRowIndex)}
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
                                    assigneesIndexes.map((friendIndex, index) => {
                                        return <AssigneeBubble
                                            key={`assignee-${index}`}
                                            friendIndex={friendIndex}
                                            onClick={() => removeAssigneeIndex(friendIndex)}
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
                                    {nonAssigneesIndexes
                                        .map((friendIndex, index) => {
                                            return <AssigneeBubble
                                                key={`FRIENDS-not-in-assignee-${index}`}
                                                friendIndex={friendIndex}
                                                onClick={() => addAssigneeIndex(friendIndex)}
                                                icon={<PlusIcon className="w-4 h-4" />} />
                                        })}
                                </div>
                            </div>
                        </div>

                        : null}
                    <div className="flex flex-col gap-1">
                        {assigneesIndexes.map((friendIndex, index) => {
                            return <AssigneeBubble key={index} friendIndex={friendIndex} />
                        })}
                    </div>
                </td>
            </tr>
        )
    }

    // helper functions
    // open/close dropdowns for ReceiptDataRow
    const [dataRowIndexDropdownOpen, setDataRowIndexDropdownOpen] = useState(-1);
    const closeAllDropdowns = () => {
        setDataRowIndexDropdownOpen(-1);
    }
    // change the name of an item
    const changeItemName = (newName, index) => {
        const new_items = [...items];
        new_items[index].name = newName;
        setItems(new_items);
    };
    // change the price of an item
    const changeItemPrice = (newPrice, index) => {
        const new_items = [...items];
        new_items[index].price = newPrice;
        setItems(new_items);
    };
    // change the quantity of an item
    const changeItemQuantity = (newQuantity, index) => {
        const new_items = [...items];
        new_items[index].quantity = newQuantity;
        setItems(new_items);
    };
    // change the assignees of an item
    const changeItemAssignees = (newAssigneesIndexes, index) => {
        const new_items = [...items];
        new_items[index].assigneesIndexes = newAssigneesIndexes;
        setItems(new_items.sort());
    };
    // calculate total price of the receipt
    const totalPrice = () => {
        let total = 0;
        items.forEach(item => {
            if (item.price) {
                total += parseFloat(item.price);
            }
        });
        // add other costs
        if (!taxExcluded) {
            total += tax;
        }
        if (!svcExcluded) {
            total += serviceCharge;
        }
        if (!discountExcluded) {
            total -= discount;
        }
        // truncate to 2 decimal places
        total = Math.round(total * 100) / 100;
        return total;
    };
    // calculate tax
    const updateTax = () => {
        let total = 0;
        items.forEach(item => {
            if (item.price) {
                total += parseFloat(item.price);
            }
        });
        const tax = total * TAX_RATE;
        // truncate to 2 decimal places
        const truncated = Math.round(tax * 100) / 100;
        // update tax
        if (truncated === priceTax.current.value) {
            return;
        }
        if (window.confirm(`New tax: ${truncated}, Proceed?`)) {
            setTax(truncated);
            priceTax.current.value = truncated;
        }
    }
    // calculate service charge
    const updateSvc = () => {
        let total = 0;
        items.forEach(item => {
            if (item.price) {
                total += parseFloat(item.price);
            }
        });
        const serviceCharge = total * SVC_RATE;
        // truncate to 2 decimal places
        const truncated = Math.round(serviceCharge * 100) / 100;
        // update service charge
        if (truncated === priceServiceCharge.current.value) {
            return;
        }
        if (window.confirm(`New service charge: ${truncated}, Proceed?`)) {
            setServiceCharge(truncated);
            priceServiceCharge.current.value = truncated;
        }
    }

    return (
        <NavBarLayout navBarText="Receipt" className="text-sm">
            {
                dataRowIndexDropdownOpen !== -1 ?
                    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full" onClick={closeAllDropdowns}></div> : null
            }
            <div className="w-full px-5 flex flex-col gap-5">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr className="border-b border-slate-300 text-xs">
                            <th className="w-4/12 text-start font-light p-1 overflow-clip">
                                <div className="flex flex-row items-center">
                                    <ShoppingCartIcon className="h-3 w-3 mr-1" />
                                    <div>
                                        Item
                                    </div>
                                </div>
                            </th>
                            <th className="w-2/12 text-start font-light p-1 overflow-clip">
                                <div className="flex flex-row items-center">
                                    <HashtagIcon className="h-3 w-3 inline-block mr-1" />
                                    <div>
                                        Qty
                                    </div>
                                </div>
                            </th>
                            <th className="w-3/12 text-start font-light p-1 overflow-clip">
                                <div className="flex flex-row items-center">
                                    <CurrencyDollarIcon className="h-3 w-3 inline-block mr-1 my-auto" />
                                    <div>
                                        Price
                                    </div>
                                </div>
                            </th>
                            <th className="w-4/12 text-start font-light p-1 overflow-clip">
                                <div className="flex flex-row items-center">
                                    <UserIcon className="h-3 w-3 inline-block mr-1" />
                                    <div>
                                        Assignees
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            return <ReceiptDataRow key={`receipt-data-row-${index}`} name={item.name} price={item.price} quantity={item.qty} assigneesIndexes={item.assigneesIndexes} dataRowIndex={index} />;
                        })}
                        <tr>
                            <td className="p-1" colSpan={2}>
                                <div className="flex flex-row gap-1 items-center font-light">
                                    <BanknotesIcon className="h-3 w-3" />
                                    <div>
                                        Tax
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-row gap-1 p-1">
                                    <div>
                                        $
                                    </div>
                                    <input
                                        ref={priceTax}
                                        key={`price-tax`}
                                        type="number"
                                        defaultValue={tax}
                                        onChange={(e) => setTax(e.target.value)}
                                        className="w-full bg-seasalt" />
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-row gap-2 font-light">
                                    <input
                                        type="checkbox"
                                        defaultChecked={taxExcluded}
                                        onChange={(e) => {
                                            setTaxExcluded(e.target.checked);
                                        }}
                                        className="" />
                                    <div>
                                        Exclude
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-1" colSpan={2}>
                                <div className="flex flex-row gap-1 items-center font-light">
                                    <div className="w-3">
                                        <HeartIcon className="h-3 w-3" />
                                    </div>
                                    <div className="align-top">
                                        Service Charge
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-row gap-1 p-1">
                                    <div>
                                        $
                                    </div>
                                    <input
                                        ref={priceServiceCharge}
                                        key={`price-svc`}
                                        type="number"
                                        defaultValue={serviceCharge}
                                        onChange={(e) => setServiceCharge(e.target.value)}
                                        className="w-full bg-seasalt" />
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-row gap-2 font-light">
                                    <input
                                        type="checkbox"
                                        defaultChecked={svcExcluded}
                                        onChange={(e) => {
                                            setSvcExcluded(e.target.checked);
                                        }}
                                        className="" />
                                    <div>
                                        Exclude
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-1" colSpan={2}>
                                <div className="flex flex-row gap-1 items-center font-light">
                                    <ReceiptPercentIcon className="h-3 w-3" />
                                    <div>
                                        Discount
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-row gap-1 p-1">
                                    <div>
                                        $
                                    </div>
                                    <input
                                        key={`price-discount`}
                                        type="number"
                                        defaultValue={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        className="w-full bg-seasalt" />
                                </div>
                            </td>
                            <td colSpan={2}>
                                <div className="flex flex-row gap-2 font-light">
                                    <input
                                        type="checkbox"
                                        defaultChecked={discountExcluded}
                                        onChange={(e) => {
                                            setDiscountExcluded(e.target.checked);
                                        }}
                                        className="" />
                                    <div>
                                        Exclude
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-1" colSpan={2}>
                                <button
                                    onClick={updateTax}
                                    className="border border-slate-400 rounded-md w-full font-light p-1">
                                    <div className="flex flex-row items-center gap-1 place-content-center">
                                        <div className="w-3 h-3">
                                            <BanknotesIcon className="w-3 h-3" />
                                        </div>
                                        <div>
                                            Calculate Tax
                                        </div>
                                    </div>
                                </button>
                            </td>
                            <td className="p-1" colSpan={2}>
                                <button
                                    onClick={updateSvc}
                                    className="border border-slate-400 rounded-md w-full font-light p-1">
                                    <div className="flex flex-row items-center gap-1 place-content-center">
                                        <div className="w-3 h-3">
                                            <HeartIcon className="w-3 h-3" />
                                        </div>
                                        <div>
                                            Calculate Svc
                                        </div>
                                    </div>
                                </button>
                            </td>
                        </tr>
                        <tr className="border-t border-slate-300">
                            <td className="p-1" colSpan={2}>
                                <div>
                                    Total
                                </div>
                                <div className="font-light text-xs text-slate-400">
                                    Calculated automatically.
                                </div>
                                <div className="font-light text-xs text-slate-400">
                                    {exclusionText}
                                </div>
                            </td>
                            <td className="p-1 align-top">
                                <div className="flex flex-row gap-1">
                                    <div>
                                        $
                                    </div>
                                    <div>
                                        {totalPrice()}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button className="" onClick={() => { }}>Save</Button>
            </div>

        </NavBarLayout>
    );
}