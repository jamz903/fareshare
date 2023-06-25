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
        axios.get(`/accounts/csrf_cookie`).then(() => {
            setToken(Cookies.get('csrftoken'));
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={token} />
    );
}

export default CSRFToken;