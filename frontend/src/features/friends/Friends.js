import NavBarLayout from "../../layouts/NavBarLayout";
import SmallButton from "../../components/SmallButton";
import { XMarkIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import CSRFToken from "../../components/CSRFToken";
import axios from "axios";

// obtain friends and requests from server
// dummy friends data
const friends = [
    /*
    {
        profilePic: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
        username: 'darielwilbert',
    },
    {
        profilePic: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
        username: 'notbingsu',
    },
    {
        profilePic: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
        username: 'annxbelle',
    }, */
]

const requests = [
    /*
    {
        profilePic: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
        username: 'dioclei',
    },
    {
        profilePic: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
        username: 'bigbraintoh',
    }, */
]

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
    // helper functions
    const acceptFriend = (username) => {

    }
    const declineFriend = (username) => {

    }
    const removeFriend = (username) => {
        if (window.confirm(`Are you sure you want to remove ${username} from your friend list?`)) {

        }
    }
    const [searchUsername, setSearchUsername] = useState('')
    const [friendRequestStatus, setFriendRequestStatus] = useState('' /* 'success' | 'error' */)
    const searchUsernameRef = useRef(null)
    const searchFriend = async (username) => {
        if (username === '') return;
        // reset search bar
        searchUsernameRef.current.value = '';
        setSearchUsername('');
        // search for friend
        const response = await axios.post('/friends/add', { username })
            .then(res => {
                return res.data;
            }).catch(err => {
                console.err(err)
            });
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
                            className="border-2 border-primary rounded-lg px-2 grow mr-5"
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
                                Error sending friend request!
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