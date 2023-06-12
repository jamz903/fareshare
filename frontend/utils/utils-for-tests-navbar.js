import React from 'react';
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider} from "react-redux";
import { drawerSlice } from "../src/components/SideDrawer/drawerSlice";
import {BrowserRouter} from "react-router-dom";
import NavBar from "../src/components/NavBar";

export function renderNavbar(
    {
        preloadedState = {drawer: {drawerOpen: false}},
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
        
    return { store, ...render(<BrowserRouter><NavBar /></BrowserRouter>, { wrapper: Wrapper, ...renderOptions }) };
}