/**
 * CSRFToken component to be included in form submissions.
 * This is important for Django to validate the form submission.
 */

import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CSRFToken = () => {
    const [token, setToken] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/accounts/csrf_cookie`);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
        setToken(Cookies.get('csrftoken'));
    }, []);

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
    );
}

export default CSRFToken;