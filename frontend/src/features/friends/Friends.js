import NavBarLayout from "../../layouts/NavBarLayout";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import FriendRequestItem from "./FriendRequestItem";
import FriendListItem from "./FriendListItem";
import FriendSearchBar from "./FriendSearchBar";
import { DarkSpinner } from "../../components/Spinner";

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
    const [loadingFriends, setLoadingFriends] = useState(false);
    const getFriends = () => {
        // returns a promise
        return axios.get('/friends/get-friends', config);
    }
    const getRequests = () => {
        // returns a promise
        return axios.get('/friends/get-requests', config);
    }

    useEffect(() => {
        const updateFriends = () => {
            setLoadingFriends(true);
            const promises = [getFriends(), getRequests()];
            Promise.all(promises).then(res => {
                const friendsResponse = res[0];
                const requestsResponse = res[1];
                if (friendsResponse.data.friends) {
                    setFriends(friendsResponse.data.friends);
                }
                if (requestsResponse.data.friend_requests) {
                    setRequests(requestsResponse.data.friend_requests);
                }
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setLoadingFriends(false);
            });
        }
        updateFriends();
    }, [])

    // helper functions for updating UI.
    // NOTE: All the requests are made to the server already, and successfully fulfilled. This is just to update the UI.
    // accept and decline friend requests
    const uiAcceptRequest = (username) => {
        const newFriend = requests.find(request => request.username === username);
        setFriends([...friends, newFriend]);
        setRequests(requests.filter(request => request.username !== username));
    }
    const uiDeclineRequest = (username) => {
        setRequests(requests.filter(request => request.username !== username));
    }
    // remove friend
    const uiRemoveFriend = (username) => {
        setFriends(friends.filter(friend => friend.username !== username));
    }

    return (
        <NavBarLayout>
            <div className="flex flex-col gap-5 w-full px-5">
                <FriendSearchBar />
                {
                    requests.length !== 0 ? (
                        <div>
                            <div className="font-light text-sm mb-1">
                                Requests
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                                {requests.map((request, index) => (
                                    <FriendRequestItem
                                        key={index}
                                        username={request.username}
                                        src={request.profilePic}
                                        onAccepted={(username) => uiAcceptRequest(username)}
                                        onDeclined={(username) => uiDeclineRequest(username)}
                                    />
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
                        loadingFriends ?
                            <div className="flex flex-row items-center gap-2">
                                <DarkSpinner />
                                <div className="text-sm">
                                    Loading friends...
                                </div>
                            </div> :
                            friends.length === 0 ? (
                                <div className="text-slate-500 text-sm">
                                    You have no friends. Add some!
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 w-full">
                                    {friends.map((friend, index) => (
                                        <FriendListItem
                                            key={friend.username}
                                            username={friend.username}
                                            src={friend.profilePic}
                                            onRemoved={(username) => uiRemoveFriend(username)} />
                                    ))}
                                </div>
                            )
                    }
                </div>
            </div>
        </NavBarLayout>
    )
}