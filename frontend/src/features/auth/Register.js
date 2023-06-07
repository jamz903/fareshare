/**
 * Register page for the app.
 */

// import authentication actions
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";
import RedirectToHome from "../../components/RedirectToHome";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Link from "../../components/Link";

export default function Register() {
  const dispatch = useDispatch();

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Format form data as plain object
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    // Form vaidation
    if (formJson.password !== formJson.re_password) {
      alert("Passwords do not match!");
      return;
    }
    if (formJson.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Dispatch an action to register the user
    dispatch(registerUser(formJson));
  }

  return (
    <RedirectToHome>
      <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center gap-16">
        <div className="mt-16">
          <Header text="Sign Up" />
        </div>
        <CSRFToken />
        <div className="flex flex-col items-center gap-6 w-full max-w-xl">
          <label className="flex flex-col items-center gap-1 w-full">
            <div className="w-full">
              Username
            </div>
            <input type="username" name="username" className="border-primary border-2 rounded-xl py-2 px-4 w-full" placeholder="Type your username" />
          </label>
          <label className="flex flex-col items-center gap-1 w-full">
            <div className="w-full">
              Password
            </div>
            <input type="password" name="password" className="border-primary border-2 rounded-xl py-2 px-4 w-full" placeholder="Type your password" />
          </label>
          <label className="flex flex-col items-center gap-1 w-full">
            <div className="w-full">
              Confirm Password
            </div>
            <input type="password" name="re_password" className="border-primary border-2 rounded-xl py-2 px-4 w-full" placeholder="Type your password again" />
          </label>
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit" text="Sign Up" />
          <div className="text-center">
            Already have an account? <Link to="/login">Login.</Link>
          </div>
        </div>
      </form>
    </RedirectToHome>
  );
}