/** 
 * This function updates the receipt object in the server. 
 * Returns a promise that resolves to the response from the server.
 */

import axios from 'axios';
import Cookies from 'js-cookie';

export default async function updateReceiptObject(id, receiptData) {
    let form_data = new FormData();
    form_data.append('id', id);
    form_data.append('processed_data', JSON.stringify(receiptData));
    let url = `/ocr/receipt_data/`;
    return axios.post(url, form_data, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    });
}