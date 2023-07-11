/**
 * ListView of all saved OCR receipts
 */

import React from 'react';
import NavBarLayout from '../../layouts/NavBarLayout';
import axios from 'axios';
import { DarkSpinner } from '../../components/Spinner';
import ViewHistoryItem from './ViewHistoryItem';

export default function ViewHistory() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
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
                                    data.map(receiptData => {
                                        return <ViewHistoryItem key={receiptData.id} receiptData={receiptData} />
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