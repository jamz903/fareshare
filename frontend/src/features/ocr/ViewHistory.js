/**
 * ListView of all saved OCR receipts
 */

import React from 'react';
import NavBarLayout from '../../layouts/NavBarLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DarkSpinner } from '../../components/Spinner';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ViewHistory() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios(`/ocr/upload/`);
        setData(response.data);
        setLoading(false);
    }

    const handleClick = (e) => {
        navigate("/receipt_data", { state: { id: e, receiptData: JSON.parse(JSON.parse(getData(data, e))) } });
    }

    const handleDelete = (e) => {
        if (window.confirm("Are you sure you want to delete this receipt?")) {

        }
    }

    function getData(data, id) {
        for (var item in data) {
            if (data[item].id === id) {
                return data[item].processed_data
            }
        }
    }


    return (
        <NavBarLayout navBarText="Receipts" className="text-sm">
            <div className="w-full px-5">
                {
                    loading ?
                        <div className='flex flex-row items-center gap-2 justify-center'>
                            <DarkSpinner />
                            Loading Receipts...
                        </div> :
                        data && data.length > 0 ?
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-center'>
                                {
                                    data.map(data => {
                                        return (
                                            <div className='flex flex-row drop-shadow'>
                                                <button key={data.id}
                                                    onClick={(e) => handleClick(data.id)}
                                                    className="block w-full rounded-l-lg p-4 bg-seasalt border border-slate-200 border-r-transparent cursor-pointer hover:border-primary active:drop-shadow-none">
                                                    <div className='text-start font-semibold'>
                                                        {data.name}
                                                    </div>
                                                    <div className='text-start font-light'>
                                                        Spent: ${data.my_expenses}
                                                    </div>
                                                </button>
                                                <button key={`delete-${data.id}`}
                                                    onClick={(e) => { handleDelete(data.id) }}
                                                    className="block rounded-r-lg p-4 bg-seasalt border border-slate-200 cursor-pointer hover:border-primary active:drop-shadow-none">
                                                    <div className='text-start font-semibold'>
                                                        <TrashIcon className="h-5 w-5 text-red" />
                                                    </div>
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div> :
                            <div className="text-center">
                                You currently have no receipts! Upload one to get started
                            </div>
                }
            </div>
        </NavBarLayout>
    );
}