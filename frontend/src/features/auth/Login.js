/**
 * Login page for the app.
 */

// use axios to submit new user data to the server
import axios from "axios";

export default function Login() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Format form data as plain object
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    // Axios will take the form data and send it to the Django server.
    axios
      .post('/api/some-endpoint', formData)
      .then(response => {
        console.log('success!' + response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="body-content-container">
      <form method="post" onSubmit={handleSubmit}>
        <div className="column gap">
          <label>
            Email:
            <input name="email" />
          </label>
          <label>
            Password:
            <input name="password" />
          </label>
          <button type="submit" className="button">Login</button>
        </div>
      </form>
    </div>
  );
}