// components
import NavBarLayout from "../../../layouts/NavBarLayout";
import { ShoppingCartIcon, CurrencyDollarIcon, HashtagIcon, UserIcon, XMarkIcon, HeartIcon, BanknotesIcon, ReceiptPercentIcon, TrashIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/Buttons/Button";
import { LightSpinner } from "../../../components/Spinner";
import ReceiptDataRow from "./ReceiptDataRow";
import TableButton from "./TableButton";
// other
import { useState, useRef, useEffect } from "react";
import { PAYMENTMETHOD } from "../ReceiptJsonParser";
import updateReceiptObject from "../UpdateReceiptObject";
// router
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// axios
import axios from "axios";
import Cookies from "js-cookie";
// debounce
import { debounce } from "lodash";
// redux store
import { useSelector } from "react-redux";

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

/*
const NULL_RECEIPT_DATA = {
    items: [
        {
            id: 2340928350,
            name: 'hello world',
            price: 0,
            quantity: 0,
            assignees: [],
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
*/

export default function ReceiptData() {
    const navigate = useNavigate();
    const location = useLocation();
    const receiptId = location.state.id;
    const username = useSelector(state => state.auth.username);

    useEffect(() => {
        const getFriends = async () => {
            // obtain friends
            // axios config
            // set axios config headers
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                }
            }
            const response = await axios.get('/friends/get-friends', config)
                .then(res => {
                    return res.data
                }).catch(err => {
                    console.error(err);
                })
            let friendList = response.friends ? response.friends : [];
            friendList = friendList.sort((a, b) => a.username.localeCompare(b.username))
            friendList.unshift({
                username: username,
            })
            friendList.forEach((friend, index) => {
                friend.colorSet = obtainRandomColorSet();
            });
            setFriends(friendList);
        }

        const getReceiptData = async () => {
            // obtain receipt data
            // axios config
            // set axios config headers
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                }
            }
            const data = await axios.post('/ocr/receipt_items_by_receipt/', { id: receiptId }, config)
                .then(res => {
                    return res.data
                }).catch(err => {
                    let message = '';
                    if (!!err.response.status) {
                        message = err.response.data.error;
                    } else if (!!err.message) {
                        message = err.message;
                    } else {
                        message = 'An unexpected error has occurred.'
                    }
                    console.error(message);
                    window.alert(message);
                })
            const responseItems = data.items ? data.items : [];
            const responseOther = data.other ? data.other : {
                // populate with default values
                subTotal: 0,
                total: 0,
                tax: 0,
                serviceCharge: 0,
                discount: 0,
                paymentMethod: PAYMENTMETHOD.CASH,
                paidAmount: 0,
                change: 0,
            };
            const newReceiptData = {
                items: responseItems,
                // TODO: fix this, some dummy data first
                other: responseOther,
            }
            console.log(newReceiptData)
            setItems(newReceiptData.items);
            setTax(newReceiptData.other.tax);
            setServiceCharge(newReceiptData.other.serviceCharge);
            setDiscount(newReceiptData.other.discount);
            setSubTotal(newReceiptData.other.subTotal);
            setPaymentMethod(newReceiptData.other.paymentMethod);
            setPaidAmount(newReceiptData.other.paidAmount);
            setChange(newReceiptData.other.change);
        }

        if (location.state.receiptData) {
            const items = location.state.receiptData.items;
            const other = location.state.receiptData.other;
            setItems(items);
            setTax(other.tax);
            setServiceCharge(other.serviceCharge);
            setDiscount(other.discount);
        } else {
            getReceiptData();
        }
        getFriends();
    }, [receiptId, username, location.state.receiptData]);

    // friends
    const [friends, setFriends] = useState([]);
    // items
    const [items, setItems] = useState([]);
    // other
    const [tax, setTax] = useState(0.0);
    const [serviceCharge, setServiceCharge] = useState(0.0);
    const [discount, setDiscount] = useState(0.0);
    const [subTotal, setSubTotal] = useState(0.0);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENTMETHOD.CASH);
    const [paidAmount, setPaidAmount] = useState(0.0);
    const [change, setChange] = useState(0.0);
    // functional state
    const priceTax = useRef(null);
    const priceServiceCharge = useRef(null);
    const [taxExcluded, setTaxExcluded] = useState(true);
    const [svcExcluded, setSvcExcluded] = useState(true);
    const [discountExcluded, setDiscountExcluded] = useState(true);
    // marking receipt items (for the server) to deleted
    const [idsToDelete, setIdsToDelete] = useState([]);

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
    const changeItemAssignees = (newAssignees, index) => {
        const new_items = [...items];
        new_items[index].assignees = newAssignees;
        setItems(new_items);
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

    // add row
    const addRow = () => {
        const newItem = {
            name: "",
            price: 0.00,
            quantity: 0,
            assignees: []
        }
        setItems([...items, newItem]);
    };
    // deletion mode
    const [deletionMode, setDeletionMode] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const openDeletionMode = () => {
        setDeletionMode(true);
        setSelectedRows([]);
    };
    const closeDeletionMode = () => {
        setDeletionMode(false);
        setSelectedRows([]);
    };
    const toggleRowSelection = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter(row => row !== index));
        } else {
            setSelectedRows([...selectedRows, index]);
        }
    };
    // delete rows
    const deleteRows = (indexes) => {
        const newItems = [];
        const additionalIdsToDelete = [];
        items.forEach((item, index) => {
            if (!indexes.includes(index)) {
                newItems.push(item);
            } else {
                // mark item as deleted if it has an id (new items have no id)
                if (item.id) {
                    additionalIdsToDelete.push(item.id);
                }
            }
        });
        setItems(newItems);
        setIdsToDelete([...idsToDelete, ...additionalIdsToDelete]);
        closeDeletionMode();
    };

    // calculate personal expenses
    const calculatePersonalExpenses = (receipt_data) => {
        const my_items = receipt_data.items.filter(item => {
            if (item.assignees && item.assignees.includes(username)) {
                return true;
            } else {
                return false;
            }
        });
        let my_expenses = 0;
        my_items.forEach(item => {
            my_expenses += parseFloat(item.price) / item.assignees.length;
        });
        return my_expenses;
    };

    //save receipt data to database
    const [saving, setSaving] = useState(false);
    const saveData = (e) => {
        setSaving(true);
        // construct receipt data object
        const new_receipt_data = {
            items: items,
            other: {
                subTotal: subTotal,
                total: totalPrice(),
                tax: tax,
                serviceCharge: serviceCharge,
                discount: discount,
                paymentMethod: paymentMethod,
                paidAmount: paidAmount,
                change: change,
            }
        }
        // calculate personal expenses
        const my_expenses = calculatePersonalExpenses(new_receipt_data);
        updateReceiptObject(my_expenses, receiptId, new_receipt_data, idsToDelete)
            .then(() => {
                navigate("/receipts");
            })
            .catch(err => {
                let message;
                if (err.response) {
                    message = err.response.data.message;
                } else {
                    message = err.message;
                }
                alert(message);
            })
            .finally(() => {
                setSaving(false);
            });
    };

    return (
        <NavBarLayout navBarText="Receipt" className="text-sm">
            {
                dataRowIndexDropdownOpen !== -1 ?
                    <div className="absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full" onClick={closeAllDropdowns}></div> : null
            }
            <div className="w-full px-5 flex flex-col gap-5">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                        <tr className="border-b border-slate-400 text-xs">
                            {
                                deletionMode ?
                                    <th className="w-1/12 text-center p-1">
                                    </th>
                                    : null
                            }
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
                        {/** Receipt Items */}
                        {items.map((item, index) => {
                            return <ReceiptDataRow
                                key={`receipt-data-row-${index}`}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                assignees={item.assignees}
                                friends={friends}
                                updateName={(newName) => changeItemName(newName, index)}
                                updatePrice={(newPrice) => changeItemPrice(newPrice, index)}
                                updateQuantity={(newQuantity) => changeItemQuantity(newQuantity, index)}
                                updateAssignees={(newAssignees) => changeItemAssignees(newAssignees, index)}
                                openAssigneeDropdown={() => setDataRowIndexDropdownOpen(index)}
                                showAssigneeDropdown={dataRowIndexDropdownOpen === index}
                                deletionMode={deletionMode}
                                isChecked={selectedRows.includes(index)}
                                toggleChecked={() => toggleRowSelection(index)}
                            />;
                        })}
                        <tr className="border-b border-slate-400">
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
                            {
                                deletionMode ?
                                    <td className="p-1" colSpan={2}>
                                        <TableButton onClick={closeDeletionMode}>
                                            <div className="w-3 h-3">
                                                <XMarkIcon className="w-3 h-3" />
                                            </div>
                                            <div>
                                                Cancel
                                            </div>
                                        </TableButton>
                                    </td> :
                                    <td className="p-1" colSpan={2}>
                                        <TableButton onClick={addRow}>
                                            <div className="w-3 h-3">
                                                <SquaresPlusIcon className="w-3 h-3" />
                                            </div>
                                            <div>
                                                Add Item
                                            </div>
                                        </TableButton>
                                    </td>
                            }
                            {
                                deletionMode ?
                                    <td className="p-1" colSpan={2}>
                                        <TableButton onClick={() => deleteRows(selectedRows)}>
                                            <div className="w-3 h-3">
                                                <TrashIcon className="w-3 h-3" />
                                            </div>
                                            <div>
                                                Confirm
                                            </div>
                                        </TableButton>
                                    </td> :
                                    <td className="p-1" colSpan={2}>
                                        <TableButton onClick={openDeletionMode}>
                                            <div className="w-3 h-3">
                                                <TrashIcon className="w-3 h-3" />
                                            </div>
                                            <div>
                                                Delete Items
                                            </div>
                                        </TableButton>
                                    </td>
                            }
                        </tr>
                        <tr>
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
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
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
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
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
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
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
                            <td className="p-1" colSpan={2}>
                                <TableButton onClick={updateTax}>
                                    <div className="w-3 h-3">
                                        <BanknotesIcon className="w-3 h-3" />
                                    </div>
                                    <div>
                                        Calculate Tax
                                    </div>
                                </TableButton>
                            </td>
                            <td className="p-1" colSpan={2}>
                                <TableButton onClick={updateSvc}>
                                    <div className="w-3 h-3">
                                        <HeartIcon className="w-3 h-3" />
                                    </div>
                                    <div>
                                        Calculate Svc
                                    </div>
                                </TableButton>
                            </td>
                        </tr>
                        <tr className="border-t border-slate-400">
                            {
                                deletionMode ?
                                    <td className="p-1">
                                    </td>
                                    : null
                            }
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
                <Button className="" onClick={debounce(saveData)} disabled={saving}>{
                    saving ?
                        <LightSpinner length={5} />
                        : "Save"
                }</Button>
            </div>

        </NavBarLayout>
    );
}