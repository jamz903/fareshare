/**
 * ListView of all saved OCR receipts
 */

import React from 'react';
import NavBarLayout from '../../layouts/NavBarLayout';
import axios from 'axios';
import { DarkSpinner } from '../../components/Spinner';
import ViewHistoryItem from './ViewHistoryItem';
import ViewHistoryPaymentItem from './ViewHistoryPaymentItem';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ViewHistoryExtrasItem from './ViewHistoryExtrasItem';
import SmallButton from '../../components/Buttons/SmallButton';
import Cookies from 'js-cookie';
import CSRFToken from '../../components/CSRFToken';

export default function ViewHistory() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState("");

    // payment summary dialog
    const dialogRef = React.useRef(null);
    const [payments, setPayments] = React.useState([]);
    const [itemsToProcess, setItemsToProcess] = React.useState([]); // raw receipt items to process, caching for recalculations
    const [loadingReceipt, setLoadingReceipt] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const [paymentTax, setPaymentTax] = React.useState(0.00);
    const [paymentServiceCharge, setPaymentServiceCharge] = React.useState(0.00);
    const [paymentDiscounts, setPaymentDiscounts] = React.useState(0.00);
    const [includeTax, setIncludeTax] = React.useState(false);
    const [includeServiceCharge, setIncludeServiceCharge] = React.useState(false);
    const [includeDiscounts, setIncludeDiscounts] = React.useState(false);

    React.useEffect(() => {
        // fetch data
        if (loading === true) {
            fetchData();
        }

        // process payments when itemsToProcess or payment settings change
        const processPayments = () => {
            const data = itemsToProcess;
            const friends = {};
            let total = 0;
            data.forEach(item => {
                total += item.price;
                const pricePerPerson = item.price / item.assignees.length;
                item.assignees.forEach(assignee => {
                    friends[assignee] = friends[assignee] ? friends[assignee] + pricePerPerson : pricePerPerson;
                });
            });
            const newPayments = Object.keys(friends).map(friend => {
                if (includeTax) {
                    const tax = paymentTax * (friends[friend] / total);
                    friends[friend] += tax;
                }
                if (includeServiceCharge) {
                    const serviceCharge = paymentServiceCharge * (friends[friend] / total);
                    friends[friend] += serviceCharge;
                }
                if (includeDiscounts) {
                    const discounts = paymentDiscounts * (friends[friend] / total);
                    friends[friend] -= discounts;
                }
                return {
                    username: friend,
                    amount: friends[friend]
                };
            })
            setPayments(newPayments);
        }
        processPayments(); // triggers rendering of payment summary list
    }, [loading, data, includeDiscounts, includeServiceCharge, includeTax, itemsToProcess, paymentDiscounts, paymentServiceCharge, paymentTax]);

    const axiosConfig = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    }

    const fetchData = async () => {
        const promises = [];
        const response = axios(`/ocr/upload/`)
            .then(res => res)
            .catch(err => {
                setErrorMessage(err.response.data.message);
                return [];
            });
        promises.push(response);
        const result = await Promise.all(promises);
        const resultData = result[0].data;
        setData(resultData);
        setLoading(false);
    }

    const deleteReceipt = (receiptId) => {
        axios.post(`/ocr/delete_receipt/`, { id: receiptId }, axiosConfig)
            .then(res => {
                if (res.data.success) {
                    const newData = data.filter(receipt => receipt.id !== receiptId);
                    setData(newData);
                }
            }).catch(err => {
                if (err.response.data.message) {
                    alert(err.response.data.message);
                } else {
                    alert('Error deleting receipt');
                }
            });
    }

    const openDialog = (receiptId) => {
        setPayments([]);
        setCopied(false);
        setIncludeTax(false);
        setIncludeServiceCharge(false);
        setIncludeDiscounts(false);
        const receipt = data.find(receipt => receipt.id === receiptId);
        setPaymentTax(receipt.tax);
        setPaymentServiceCharge(receipt.service_charge);
        setPaymentDiscounts(receipt.discounts);
        fetchReceiptPayments(receiptId);
        dialogRef.current.showModal();
    }

    const closeDialog = () => {
        dialogRef.current.close();
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }

    const fetchReceiptPayments = async (receiptId) => {
        setLoadingReceipt(true);
        const items = await axios.post(`/ocr/receipt_items_by_receipt/`, { id: receiptId }, axiosConfig)
            .then(res => {
                setLoadingReceipt(false);
                return res.data.items;
            }).catch(err => {
                if (err.response.data.message) {
                    alert(err.response.data.message);
                } else {
                    alert('Error fetching receipt payments');
                }
            });
        setItemsToProcess(items);
    }

    const copyPaymentsToClipboard = () => {
        const text = payments.map(payment => {
            return `${payment.username}: ${payment.amount.toFixed(2)}`;
        }).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
        })
    };

    const paymentItemList = () => {
        const arr = payments.map(payment => {
            return <ViewHistoryPaymentItem key={payment.username} username={payment.username} amount={payment.amount} />
        });
        const splitter =
            <div className='flex flex-row justify-between text-sm font-light items-center'>
                <div className='font-semibold'>
                    Include:
                </div>
                <div className='flex flex-row gap-1'>
                    <input type='checkbox' onChange={(e) => {
                        setIncludeTax(e.target.checked);
                    }} />
                    <div>
                        Tax
                    </div>
                </div>
                <div className='flex flex-row gap-1'>
                    <input type='checkbox' onChange={(e) => {
                        setIncludeServiceCharge(e.target.checked);
                    }} />
                    <div>
                        Svc
                    </div>
                </div>
                <div className='flex flex-row gap-1'>
                    <input type='checkbox' checked={includeDiscounts} onChange={(e) => {
                        setIncludeDiscounts(e.target.checked);
                    }} />
                    <div>
                        Discounts
                    </div>
                </div>
            </div>
        const extras =
            <div>
                <ViewHistoryExtrasItem name='Tax' amount={paymentTax} />
                <ViewHistoryExtrasItem name='Service Charge' amount={paymentServiceCharge} />
                <ViewHistoryExtrasItem name='Discounts' amount={paymentDiscounts} />
            </div>
        const copyButton =
            <SmallButton className='px-4 w-full' onClick={copyPaymentsToClipboard}>
                {copied ? "Copied!" : "Copy to Clipboard"}
            </SmallButton>
        const closeButton =
            <SmallButton className='px-4 w-full' onClick={closeDialog}>
                Close
            </SmallButton>
        if (arr.length === 0) {
            return <div className='flex flex-col gap-3 w-full'>
                <div className='font-light text-sm'>
                    No payments to display. <br />
                    Add items to your receipt and assign them to users to see the payment summary.
                </div>
                {closeButton}
            </div>
        } else {
            return <div className='flex flex-col gap-2 w-full'>
                {arr}
                {splitter}
                {extras}
                {copyButton}
            </div>
        }
    }

    return (
        <NavBarLayout navBarText="Receipts" className="text-sm">
            <CSRFToken />
            <dialog ref={dialogRef} className="w-[80%] sm:w-[60%] max-h-[60%] rounded-lg drop-shadow bg-seasalt" onClick={closeDialog}>
                <div className='w-full h-full min-h-fit' onClick={stopPropagation}>
                    <div className='flex flex-row justify-between items-center pb-2'>
                        <div className='text-lg'>
                            Payment Summary
                        </div>
                        <div>
                            <XMarkIcon className="w-5 h-5" onClick={closeDialog} />
                        </div>
                    </div>
                    {
                        loadingReceipt ?
                            <div className='flex flex-row gap-3'>
                                <DarkSpinner />
                                <div>
                                    Loading...
                                </div>
                            </div> :
                            paymentItemList()
                    }
                </div>
            </dialog>
            <div className="w-full px-5">
                {
                    loading ?
                        <div className='flex flex-row items-center gap-2 justify-center'>
                            <DarkSpinner />
                            Loading Receipts...
                        </div> :
                        data && data.length > 0 ?
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-center'>
                                {
                                    data.map(receiptData => {
                                        return <ViewHistoryItem key={receiptData.id} receiptData={receiptData} showPayments={openDialog} deleteReceipt={deleteReceipt} />
                                    })
                                }
                            </div> :
                            <div className="text-center">
                                {
                                    errorMessage ?
                                        <span className='text-red'>{errorMessage}</span> :
                                        <span className='text-sm'>You currently have no receipts! Upload one to get started.</span>
                                }
                            </div>
                }
            </div>
        </NavBarLayout>
    );
}