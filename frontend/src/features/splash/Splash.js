import Header from "../../components/Header";
import Button from "../../components/Button";
import Link from "../../components/Link";
import { useNavigate } from "react-router-dom";

export default function Splash() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="mt-16">
                <img className="rounded-full w-40 h-40 object-cover" src="https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmljZSUyMGJvd2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" alt="logo" />
            </div>
            <div className="flex flex-col items-center">
                <Header text="fareshare" />
                <div className="text-center font-medium text-lg">
                    splitting bills has never been easier.
                </div>
            </div>
            <div className="mt-6">
                <Button text="Login" onClick={() => navigate("/login")} />
            </div>
            <div>
                <Button text="Sign Up" onClick={() => navigate("/register")} />
            </div>
            <div>
                New here? <Link to="/camera">Try Guest Mode.</Link>
            </div>
        </div>
    );
}