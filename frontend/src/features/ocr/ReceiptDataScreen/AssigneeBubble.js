export default function AssigneeBubble({ friend, onClick = () => { }, icon = null }) {
    const colorSet = friend ? friend.colorSet : '';
    const username = friend ? friend.username : '';
    return (
        <div className={`flex flex-row p-1 px-3 items-center place-content-between rounded-full ${colorSet}`} onClick={onClick}>
            <div className="text-ellipsis overflow-hidden">
                {username}
            </div>
            {icon ?
                <div className="w-4">
                    {icon}
                </div> : null
            }
        </div>
    )
}