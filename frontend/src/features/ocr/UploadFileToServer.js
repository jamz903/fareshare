/** 
 * This function uploads a file to the server. 
 * Returns a promise that resolves to the response from the server.
 */

import axios from 'axios';
import Cookies from 'js-cookie';

export default async function uploadFileToServer(name, image, receiptType) {
    let form_data = new FormData();
    //if name doesn't have an extension, add one
    if (!name.includes('.')) {
        name += '.jpg';
    }
    form_data.append('image', image, name);
    form_data.append('name', name);
    form_data.append('receipt_type', receiptType);
    let url = `/ocr/upload/`;
    return axios.post(url, form_data, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    });
}