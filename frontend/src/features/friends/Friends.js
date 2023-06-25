import NavBarLayout from "../../layouts/NavBarLayout";
import SmallButton from "../../components/SmallButton";
import { XMarkIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import CSRFToken from "../../components/CSRFToken";
import axios from "axios";
import Cookies from "js-cookie";

// child components
function FriendRow({ username, src = '', onRemove = () => { } }) {
    return (
        <div className="w-full flex flex-row place-content-between items-center">
            <div className="flex flex-row gap-4 items-center">
                <img src={src} alt='' className="rounded-full h-10 w-10" />
                <div className="font-semibold">
                    {username}
                </div>
            </div>
            <div>
                <SmallButton className="px-4" onClick={onRemove}>Remove</SmallButton>
            </div>
        </div>
    )
}

function FriendRequestRow({ username, src = '', onAccept = () => { }, onDecline = () => { } }) {
    return (
        <div className="w-full flex flex-row place-content-between items-center">
            <div className="flex flex-row gap-4 items-center">
                <img src={src} alt='' className="rounded-full h-10 w-10" />
                <div className="font-semibold">
                    {username}
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <SmallButton bgColor={'primary'} onClick={onAccept}>
                    <CheckIcon className="h-5 w-5" />
                </SmallButton>
                <SmallButton bgColor={'red'} onClick={onDecline}>
                    <XMarkIcon className="h-5 w-5" />
                </SmallButton>
            </div>
        </div>
    )
}

export default function Friends() {
    // set axios config headers
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    }
    // obtain friends and requests from server
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const getFriends = async () => {
        const response = await axios.get('/friends/get-friends', config);
        if (response.error) {
            console.err(response.error)
        } else {
            if (response.data.friends) {
                setFriends(response.data.friends);
            }
        }
    }
    const getRequests = async () => {
        const response = await axios.get('/friends/get-requests', config);
        if (response.error) {
            console.err(response.error)
        } else {
            if (response.data.friend_requests) {
                setRequests(response.data.friend_requests);
            }
        }
    }
    useEffect(() => {
        getFriends();
        getRequests();
    }, [])
    // helper functions
    const acceptFriend = async (username) => {
        const response = await axios.post('/friends/accept-request', { username }, config)
            .then(res => {
                return res.data;
            }).catch(err => {
                console.err(err)
            });
        if (response.success) {
            getFriends();
            getRequests();
        }
    }
    const declineFriend = async (username) => {
        const response = await axios.post('/friends/reject-request', { username }, config)
            .then(res => {
                return res.data
            }).catch(err => {
                console.err(err)
            });
        if (response.success) {
            getRequests();
        }
    }
    const removeFriend = async (username) => {
        if (window.confirm(`Are you sure you want to remove ${username} from your friend list?`)) {
            const response = await axios.post('/friends/remove-friend', { username }, config)
                .then(res => {
                    return res.data
                }).catch(err => {
                    console.err(err)
                });
            if (response.success) {
                getFriends();
            }
        }
    }
    const [searchUsername, setSearchUsername] = useState('')
    const [friendRequestStatus, setFriendRequestStatus] = useState('' /* 'success' | 'error' */)
    const borderColor = friendRequestStatus === 'success' ? 'border-green' : friendRequestStatus === 'error' ? 'border-red' : 'border-primary';
    const [errorMessage, setErrorMessage] = useState('')
    const searchUsernameRef = useRef(null)

    const searchFriend = async (username) => {
        if (username === '') return;
        // reset search bar
        searchUsernameRef.current.value = '';
        setSearchUsername('');
        // search for friend
        const response = await axios.post('/friends/send-request', { username }, config)
            .then(res => {
                console.log(res.data);
                return res.data;
            }).catch(err => {
                console.err(err)
            });
        if (response.error) {
            setErrorMessage(response.error)
            setFriendRequestStatus('error')
        } else if (response.success) {
            setFriendRequestStatus('success')
        }
    }

    return (
        <NavBarLayout>
            <div className="flex flex-col gap-5 w-full px-5">
                <div>
                    <div className="font-light text-sm mb-1">
                        Add Friend
                    </div>
                    <form className="flex flex-row place-content-between">
                        <CSRFToken />
                        <input
                            ref={searchUsernameRef}
                            placeholder="Enter a username"
                            className={"border-2 rounded-lg px-2 grow mr-5 " + borderColor}
                            defaultValue={searchUsername}
                            onChange={(e) => {
                                setSearchUsername(e.target.value)
                            }} />
                        <SmallButton type='submit' bgColor="primary" onClick={(e) => {
                            e.preventDefault();
                            searchFriend(searchUsername);
                        }}>
                            <PlusIcon className="h-5 w-5" />
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
                {
                    requests.length !== 0 ? (
                        <div>
                            <div className="font-light text-sm mb-1">
                                Requests
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                                {requests.map((request, index) => (
                                    <FriendRequestRow
                                        key={index}
                                        username={request.username}
                                        src={request.profilePic}
                                        onAccept={() => acceptFriend(request.username)}
                                        onDecline={() => declineFriend(request.username)} />
                                ))}
                            </div>
                        </div>
                    ) : null
                }
                <div>
                    <div className="font-light text-sm mb-1">
                        Friends
                    </div>
                    {
                        friends.length === 0 ? (
                            <div className="text-slate-500 text-sm">
                                You have no friends. Add some!
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 w-full">
                                {friends.map((friend, index) => (
                                    <FriendRow
                                        key={index}
                                        username={friend.username}
                                        src={friend.profilePic}
                                        onRemove={() => removeFriend(friend.username)} />
                                ))}
                            </div>
                        )
                    }

                </div>
            </div>
        </NavBarLayout>
    )
}