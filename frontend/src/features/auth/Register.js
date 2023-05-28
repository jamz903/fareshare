/**
 * Register page for the app.
 */

// import authentication actions
import { useDispatch } from "react-redux";
import { registerUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";
import RedirectToHome from "../../components/RedirectToHome";

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
      <form method="post" onSubmit={handleSubmit} className="d-flex flex-column justify-content-start">
        <CSRFToken />
        <label className="py-2">
          Username:
          <input name="username" />
        </label>
        <label className="py-2">
          Password:
          <input type="password" name="password" />
        </label>
        <label className="py-2">
          Confirm Password:
          <input type="password" name="re_password" />
        </label>
        <div className="py-2">
          <button type="submit" className="btn btn-secondary">Register</button>
        </div>
      </form>
    </RedirectToHome>
  );
}