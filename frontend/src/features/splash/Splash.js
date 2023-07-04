import Header from "../../components/Header";
import Button from "../../components/Buttons/Button";
import Link from "../../components/Link";
import { useNavigate } from "react-router-dom";
import RiceBowl from "../../components/RiceBowl";

export default function Splash() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="mt-16">
                <RiceBowl width="40" height="40" />
            </div>
            <div className="flex flex-col items-center">
                <Header text="fareshare" />
                <div className="text-center font-medium text-lg">
                    splitting bills has never been easier.
                </div>
            </div>
            <div className="mt-6">
                <Button onClick={() => navigate("/login")}>
                    Log In
                </Button>
            </div>
            <div>
                <Button onClick={() => navigate("/register")}>
                    Sign Up
                </Button>
            </div>
            <div>
                New here? <Link to="/camera">Try Guest Mode.</Link>
            </div>
        </div>
    );
}