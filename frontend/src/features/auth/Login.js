/**
 * Login page for the app.
 */
// import authentication actions
import { useDispatch } from "react-redux";
import { loginUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";
import RedirectToHome from "../../components/RedirectToHome";
import Header from "../../components/Header";
import Button from "../../components/Buttons/Button";
import Link from "../../components/Link";
import FormInput from "./FormInput";
import { useState } from "react";
import { LightSpinner } from "../../components/Spinner";

export default function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Format form data as plain object
    const formJson = Object.fromEntries(formData.entries());

    setLoading(true);
    // dispatch the login action
    dispatch(loginUser(formJson))
      .unwrap()
      .then(response => {

      }).catch(error => {
        setUsernameStatus(ERROR);
        setPasswordStatus(ERROR);
        setPasswordErrorMessage(error.message);
      }).finally(() => {
        setLoading(false);
      });
  }

  // error handling
  const [SUCCESS, ERROR, DEFAULT] = ['SUCCESS', 'ERROR', 'DEFAULT'];
  const [usernameStatus, setUsernameStatus] = useState('DEFAULT');
  const [passwordStatus, setPasswordStatus] = useState('DEFAULT');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const onPasswordChange = (e) => {
    if (passwordStatus === ERROR) {
      setUsernameStatus(DEFAULT);
      setPasswordStatus(DEFAULT);
      setPasswordErrorMessage('');
    }
  };

  return (
    <RedirectToHome>
      <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center gap-16 px-5">
        <div className="mt-16">
          <Header text="Login" />
        </div>
        <CSRFToken />
        <div className="flex flex-col items-center gap-6 w-full max-w-xl">
          <FormInput
            label="Username"
            type="username"
            name="username"
            placeholder="Type your username"
            status={usernameStatus}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Type your password"
            status={passwordStatus}
            errorMessage={passwordErrorMessage}
            onChange={onPasswordChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit">
            {loading ? <LightSpinner /> : 'Login'}
          </Button>
          <div className="text-center">
            Don't have an account? <Link to="/register">Sign up.</Link>
          </div>
        </div>
      </form>
    </RedirectToHome>
  );
}