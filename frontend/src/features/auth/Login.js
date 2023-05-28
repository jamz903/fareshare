/**
 * Login page for the app.
 */
// import authentication actions
import { useDispatch } from "react-redux";
import { loginUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";
import RedirectToHome from "../../components/RedirectToHome";

export default function Login() {
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

    // dispatch the login action
    dispatch(loginUser(formJson));
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
        <div className="py-2">
          <button type="submit" className="btn btn-secondary">Login</button>
        </div>
      </form>
    </RedirectToHome>
  );
}