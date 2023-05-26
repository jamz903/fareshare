/**
 * Register page for the app.
 */

// import authentication actions
import { useDispatch } from "react-redux";
import { registerUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";

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
    <div className="body-content-container">
      <form method="post" onSubmit={handleSubmit}>
        <CSRFToken />
        <div className="column gap">
          <label>
            Username:
            <input name="username" />
          </label>
          <label>
            Password:
            <input name="password" />
          </label>
          <label>
            Confirm Password:
            <input name="re_password" />
          </label>
          <button type="submit" className="button">Register</button>
        </div>
      </form>
    </div>
  );
}