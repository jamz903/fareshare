/**
 * ListView of all saved OCR receipts
 */

import React from 'react';
import NavBarLayout from '../../layouts/NavBarLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ViewHistory() {
    const [data, setData] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios(`/ocr/upload/`);
        setData(response.data);
    }

    if (data == []) {
        <h1>You currently have no receipts! Upload one to get started</h1>
    }

    const handleClick = (e) => {
        navigate("/receipt_data", { state: { id: e, receiptData: JSON.parse(JSON.parse(getData(data, e))) } });
    }

    function getData(data, id) {
        for (var item in data) {
            if (data[item].id == id) {
                return data[item].processed_data
            }
        }
    }


    return (
        <NavBarLayout navBarText="Receipts" className="text-sm">
            <div class="w-96">
                { data && data.map(data => {
                    return(
                        <button key={ data.id }
                            onClick={(e) => handleClick(data.id)}
                            class="block w-full cursor-pointer hover:bg-secondary hover:opacity-90 rounded-lg bg-primary-100 p-4 text-primary-600">
                            { data.name }
                            <br />
                            <div>Spent: ${ data.my_expenses }</div>
                        </button>
                    )
                })}
            </div>
        </NavBarLayout>
    );
}