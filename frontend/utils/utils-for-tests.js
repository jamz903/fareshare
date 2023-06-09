import React from 'react';
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider} from "react-redux";
import { drawerSlice } from "../src/components/SideDrawer/drawerSlice";
import {BrowserRouter} from "react-router-dom";
import App from "../src/App";

export function renderWithProviders(
    {
        preloadedState = {},
        store = configureStore({
            reducer: { drawer: drawerSlice.reducer },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
        
    return { store, ...render(<BrowserRouter><App /></BrowserRouter>, { wrapper: Wrapper, ...renderOptions }) };
}