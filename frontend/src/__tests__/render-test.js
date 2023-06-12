import React from 'react';
import { render, screen, cleanup } from "@testing-library/react";
import SideDrawerButton from "../components/SideDrawer/SideDrawerButton";
import Button from "../components/Button";
import RiceBowl from "../components/RiceBowl";
import { renderWithProviders } from "../../utils/utils-for-tests"
import SideDrawer from "../components/SideDrawer/SideDrawer"
import Header from "../components/Header"
import Link from "../components/Link"
import { BrowserRouter } from 'react-router-dom'

describe('SideDrawerButton', () => {
    it("should render SideDrawerButton component", () => {
        render(<SideDrawerButton />);
        const element = screen.getByRole('button');
        expect(element).toBeInTheDocument();
    });
});

describe('Button', () => {
    it("should render button component", () => {
        render(<Button />);
        const element = screen.getByRole('button');
        expect(element).toBeInTheDocument();
    });
});

describe('RiceBowl', () => {
    it("should render ricebowl component", () => {
        render(<RiceBowl />);
        const element = screen.getByRole('img');
        expect(element).toBeInTheDocument();
    });
});
 
test("drawer", async () => {
    renderWithProviders(<SideDrawer />)
    const element = await screen.findAllByRole("button")
    expect(element).toHaveLength(6)
  })

describe('Header', () => {
    it("should render header", () => {
        render(<Header />);
        const element = screen.getByRole('heading');
        expect(element).toBeInTheDocument();
    });
});

describe('Link', () => {
    it("should render link", () => {
        render(<BrowserRouter><Link /></BrowserRouter>);
        const element = screen.getByRole('link');
        expect(element).toBeInTheDocument();
    });
});


