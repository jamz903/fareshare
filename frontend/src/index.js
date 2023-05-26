import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// router
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// redux
import { Provider } from 'react-redux';
import { store } from './store';
// other pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import About from './features/about/About';

// router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        /* register page */
        path: "/register",
        element: <Register />
      },
      {
        /* show about page when the path is empty */
        path: "/",
        element: <About />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
