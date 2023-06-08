import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// tailwindcss import
import './index.css';
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
import Home from './features/home/Home';
import Profile from './features/profile/Profile';
import Camera from './features/ocr/Camera';
import Splash from './features/splash/Splash';
import Upload from './features/ocr/Upload';

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
        /* home page */
        path: "/home",
        element: <Home />
      },
      {
        /* profile page */
        path: "/profile",
        element: <Profile />
      },
      {
        /* camera page */
        path: "/camera",
        element: <Camera />
      },
      {
        /* about page */
        path: "/about",
        element: <About />
      },
      {
        path: "/upload",
        element: <Upload />
      },
      {
        /* show splash page when the path is empty */
        path: "/",
        element: <Splash />
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
