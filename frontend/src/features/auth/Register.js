/**
 * Register page for the app.
 */

// import authentication actions
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "./authSlice";
import CSRFToken from "../../components/CSRFToken";
import RedirectToHome from "../../components/RedirectToHome";
import Header from "../../components/Header";
import Button from "../../components/Buttons/Button";
import Link from "../../components/Link";
import { useState } from "react";
import FormInput from "./FormInput";
import { LightSpinner } from "../../components/Spinner";

export default function Register() {
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

    // Form vaidation, make sure all errors are false
    if ([passwordStatus, rePasswordStatus, usernameStatus].some((status) => status === ERROR)) {
      return;
    }

    // Set loading icon
    setLoading(true);

    // Dispatch an action to register the user
    dispatch(registerUser(formJson))
      .unwrap()
      .then((result) => {
        const loginFormJson = { username: formJson.username, password: formJson.password }
        return dispatch(loginUser(loginFormJson))
          .unwrap()
          .then((result) => {
            // should redirect
          }).catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        if (error.status === 409) {
          setUsernameStatus(ERROR);
          setUsernameErrorMessage('Username already exists.');
        } else {
          setUsernameStatus(ERROR);
          setPasswordStatus(ERROR);
          setRePasswordStatus(ERROR);
          setRePasswordErrorMessage(error.message);
        }
        setLoading(false);
      })
  }

  // error handling
  const [SUCCESS, ERROR, NONE] = ['SUCCESS', 'ERROR', 'NONE'];
  const [usernameStatus, setUsernameStatus] = useState(NONE);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(NONE);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [rePasswordStatus, setRePasswordStatus] = useState(NONE);
  const [rePasswordErrorMessage, setRePasswordErrorMessage] = useState('');

  const onUsernameChange = (e) => {
    // reset error if any
    if (usernameStatus === ERROR) {
      setUsernameStatus(NONE);
      setUsernameErrorMessage('');
    }
  };
  const onPasswordChange = (e) => {
    // perform form validation
    const password = e.target.value;
    const re_password = document.querySelector('input[name="re_password"]').value;
    // make sure password is > 6 characters long
    if (password.length > 0 && password.length < 6) {
      setPasswordStatus(ERROR);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
    } else if (passwordStatus === ERROR) {
      setPasswordStatus(NONE);
      setPasswordErrorMessage('');
    }
    // make sure passwords match
    if (password !== re_password) {
      setRePasswordStatus(ERROR);
      setRePasswordErrorMessage('Passwords do not match.');
    } else if (rePasswordStatus === ERROR) {
      setRePasswordStatus(NONE);
      setRePasswordErrorMessage('');
    }
  };
  const onRePasswordChange = (e) => {
    // perform form validation
    const rePassword = e.target.value;
    const password = document.querySelector('input[name="password"]').value;
    // make sure passwords match
    if (rePassword !== password) {
      setRePasswordStatus(ERROR);
      setRePasswordErrorMessage('Passwords do not match.');
    } else if (rePasswordStatus === ERROR) {
      setRePasswordStatus(NONE);
      setRePasswordErrorMessage('');
    }
  };

  return (
    <RedirectToHome>
      <form method="post" onSubmit={handleSubmit} className="flex flex-col items-center gap-16 px-5">
        <div className="mt-16">
          <Header text="Sign Up" />
        </div>
        <CSRFToken />
        <div className="flex flex-col items-center gap-6 w-full max-w-xl">
          <FormInput
            label="Username"
            type="username"
            name="username"
            placeholder="Type your username"
            status={usernameStatus}
            errorMessage={usernameErrorMessage}
            onChange={onUsernameChange}
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
          <FormInput
            label="Confirm Password"
            type="password"
            name="re_password"
            placeholder="Type your password again"
            status={rePasswordStatus}
            errorMessage={rePasswordErrorMessage}
            onChange={onRePasswordChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button type="submit">
            {loading ? <LightSpinner /> : 'Sign Up'}
          </Button>
          <div className="text-center">
            Already have an account? <Link to="/login">Login.</Link>
          </div>
        </div>
      </form>
    </RedirectToHome>
  );
}