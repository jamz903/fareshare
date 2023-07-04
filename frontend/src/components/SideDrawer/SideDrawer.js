import Header from "../Header";
import { useSelector, useDispatch } from "react-redux";
import { setDrawerOpen } from "./drawerSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../features/auth/authSlice";
import SideDrawerButton from "./SideDrawerButton";
import { DarkSpinner } from "../Spinner";

export default function SideDrawer() {
    const open = useSelector(state => state.drawer.drawerOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function closeDrawer() {
        dispatch(setDrawerOpen(false));
    }

    const [loadingLogout, setLoadingLogout] = useState(false);
    const handleLogout = () => {
        setLoadingLogout(true);
        dispatch(logoutUser({}))
            .unwrap()
            .then((result) => {
                setLoadingLogout(false);
                closeDrawer();
                navigate('/login');
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    }

    const openClass = open ? 'translate-x-0' : '-translate-x-full';
    const posClasses = "sm:w-1/3 w-[80%] h-full fixed top-0 left-0 bot-0 z-40 ";
    const transClasses = "transition-all duration-300 ease-in-out ";
    const visualClasses = "drop-shadow bg-seasalt p-5 flex flex-col gap-6 ";

    const hiddenClass = open ? " " : "w-0 overflow-hidden invisible";

    const divOuter = "w-full h-full fixed top-0 left-0 bot-0 z-30 ";
    const divBg = "h-full w-full opacity-5 bg-black ";

    return (
        <div className={divOuter + hiddenClass}>
            <div className={posClasses + transClasses + visualClasses + openClass}>
                <div className="flex flex-col gap-2">
                    <Header text="fareshare" />
                    <hr />
                </div>
                <div className="flex flex-col gap-8">
                    <SideDrawerButton onClick={() => { navigate('/camera'); closeDrawer(); }}>Capture Receipt</SideDrawerButton>
                    <SideDrawerButton onClick={() => { navigate('/upload'); closeDrawer(); }}>Upload Receipt</SideDrawerButton>
                    <SideDrawerButton onClick={() => { navigate('/home'); closeDrawer(); }}>Home</SideDrawerButton>
                    <SideDrawerButton onClick={() => { navigate('/receipts'); closeDrawer(); }}>Receipts</SideDrawerButton>
                    {/* <SideDrawerButton onClick={() => { navigate('/profile'); closeDrawer(); }}>Profile</SideDrawerButton> */}
                    <SideDrawerButton onClick={() => { navigate('/friends'); closeDrawer(); }}>Friends</SideDrawerButton>
                    {/* <SideDrawerButton onClick={() => { navigate('/settings'); closeDrawer(); }}>Settings</SideDrawerButton> */}
                    <SideDrawerButton onClick={() => { handleLogout(); }} disabled={loadingLogout}>{
                        loadingLogout ? <DarkSpinner /> : "Logout"
                    }</SideDrawerButton>
                </div>
            </div>
            <div className={divBg + hiddenClass} onClick={closeDrawer} data-testid="id">
            </div>
        </div>
    );
}