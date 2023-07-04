import CSRFToken from "../../components/CSRFToken";
import SmallButton from "../../components/Buttons/SmallButton";
import { PlusIcon } from "@heroicons/react/24/outline";
import Spinner from "../../components/Spinner";
import { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function FriendSearchBar() {
    const [searchUsername, setSearchUsername] = useState('');
    const [searching, setSearching] = useState(false);
    const [friendRequestStatus, setFriendRequestStatus] = useState('');
    const borderColor = friendRequestStatus === 'success' ? 'border-green' : friendRequestStatus === 'error' ? 'border-red' : 'border-primary';
    const [errorMessage, setErrorMessage] = useState('');
    const searchUsernameRef = useRef(null);

    // set axios config headers
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    }

    const searchFriend = async (username) => {
        if (username === '') return;
        // reset search bar
        searchUsernameRef.current.value = '';
        setSearchUsername('');
        // search for friend
        setSearching(true);
        const promises = [];
        const response = axios.post('/friends/send-request', { username }, config)
            .then(res => {
                if (res.data.success) {
                    setFriendRequestStatus('success')
                } else if (res.data.error) {
                    setFriendRequestStatus('error')
                    setErrorMessage(res.data.error)
                }
                return res.data
            }).catch(err => {
                console.err(err)
            });
        promises.push(response);
        await Promise.all(promises);
        setSearching(false);
    }

    return (
        <div className="w-full">
            <div className="font-light text-sm mb-1">
                Add Friend
            </div>
            <form className="flex flex-row gap-5 place-content-between" onSubmit={(e) => {
                e.preventDefault();
                searchFriend(searchUsername);
            }}>
                <CSRFToken />
                <input
                    ref={searchUsernameRef}
                    placeholder="Enter a username"
                    className={"border-2 rounded-lg px-2 w-full " + borderColor}
                    defaultValue={searchUsername}
                    disabled={searching}
                    onChange={(e) => {
                        setSearchUsername(e.target.value)
                        setFriendRequestStatus('')
                    }} />
                <SmallButton type='submit' bgColor="primary" disabled={searching}>
                    {
                        searching ?
                            <Spinner bgColor="primary" spinnerColor="seasalt" length={5} />
                            : <PlusIcon className="h-5 w-5" />
                    }
                </SmallButton>
            </form>
            {
                friendRequestStatus === 'success' ? (
                    <div className="text-sm text-green mt-1">
                        Friend request sent!
                    </div>
                ) : friendRequestStatus === 'error' ? (
                    <div className="text-sm text-red mt-1">
                        {errorMessage ? errorMessage : 'Error sending friend request!'}
                    </div>
                ) : null
            }
        </div>
    )
}