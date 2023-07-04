import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallButton from '../../components/Buttons/SmallButton';
import { LightSpinner } from '../../components/Spinner';

export default function FriendListItem({ username, src = '', onRemoved = () => { }, onError = () => { } }) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
    }
    const [removing, setRemoving] = useState(false)
    const onRemove = async () => {
        if (window.confirm(`Are you sure you want to remove ${username} from your friend list?`)) {
            setRemoving(true);
            const promises = []
            const response = axios.post('/friends/remove-friend', { username }, config)
                .then(res => {
                    if (res.data.success) {
                        onRemoved(username);
                    }
                    return res.data
                }).catch(err => {
                    alert(err.response.data.message)
                    console.error(err)
                }).finally(() => {
                    setRemoving(false);
                });
            promises.push(response);
            const results = await Promise.all(promises);
            setRemoving(false);
            return results[0];
        }
    }

    return (
        <div className="w-full flex flex-row place-content-between items-center">
            <div className="flex flex-row gap-4 w-full items-center">
                <img src={src} alt='' className="rounded-full h-10 w-10" />
                <div className="grow overflow-clip text-ellipsis font-semibold">
                    {username}
                </div>
            </div>
            <div>
                <SmallButton className="px-4 w-20 flex flex-col items-center" onClick={onRemove} disabled={removing}>{
                    removing ?
                        <LightSpinner length={5} />
                        : "Remove"
                }</SmallButton>
            </div>
        </div>
    )
}