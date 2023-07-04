import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import SmallButton from '../../components/Buttons/SmallButton';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner';

export default function FriendRequestItem({ username, src = '', onAccepted = (username) => { }, onDeclined = (username) => { } }) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    }
    const [accepting, setAccepting] = useState(false)
    const [declining, setDeclining] = useState(false)
    const onAccept = async () => {
        setAccepting(true);
        const promises = [];
        const response = axios.post('/friends/accept-request', { username }, config)
            .then(res => {
                if (res.data.success) {
                    onAccepted(username);
                    return res.data;
                } else {
                    throw new Error('An unknown error occurred while accepting friend request')
                }
            }).catch(err => {
                if (err.response && err.response.data) {
                    const message = err.response.data.message;
                    console.error(message);
                    alert(message);
                } else {
                    const message = err.message
                    console.error(message);
                    alert(message)
                }
            });
        promises.push(response);
        const responses = await Promise.all(promises);
        setAccepting(false);
        return responses[0];
    }
    const onDecline = async () => {
        setDeclining(true);
        const promises = [];
        const response = axios.post('/friends/reject-request', { username }, config)
            .then(res => {
                if (res.data.success) {
                    onDeclined(username)
                } else {
                    throw new Error('An unknown error occurred while rejecting friend request')
                }
            }).catch(err => {
                if (err.response && err.response.data) {
                    const message = err.response.data.message;
                    console.error(message);
                    alert(message);
                } else {
                    const message = err.message
                    console.error(message);
                    alert(message)
                }
            })
        promises.push(response);
        const responses = await Promise.all(promises)
        setDeclining(false)
        return responses[0];
    }

    return (
        <div className="w-full flex flex-row place-content-between items-center">
            <div className="flex flex-row gap-4 items-center">
                <img src={src} alt='' className="rounded-full h-10 w-10" />
                <div className="font-semibold">
                    {username}
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <SmallButton bgColor={'primary'} onClick={onAccept} disabled={accepting || declining}>
                    {
                        accepting ?
                            <Spinner bgColor="primary" spinnerColor="seasalt" length={5} />
                            : <CheckIcon className="h-5 w-5" />
                    }
                </SmallButton>
                <SmallButton bgColor={'red'} onClick={onDecline} disabled={accepting || declining}>
                    {
                        declining ?
                            <Spinner bgColor="red" spinnerColor="seasalt" length={5} />
                            : <XMarkIcon className="h-5 w-5" />
                    }
                </SmallButton>
            </div>
        </div>
    )
}