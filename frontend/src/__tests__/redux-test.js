import {render, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from "../../utils/utils-for-tests"
import { renderNavbar } from "../../utils/utils-for-tests-navbar"
import SideDrawer from "../components/SideDrawer/SideDrawer"
import { MemoryRouter } from "react-router-dom"
import Button from "../components/Button";
import SideDrawerButton from "../components/SideDrawer/SideDrawerButton";
import NavBar from "../components/NavBar"

describe("capture receipt test", () => {
    it("renders capture receipt", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/capture receipt/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe("upload receipt test", () => {
    it("renders upload receipt", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/upload receipt/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe("home test", () => {
    it("renders home", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/home/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe("profile test", () => {
    it("renders profile", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/profile/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe("settings test", () => {
    it("renders settings", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/settings/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe("logout test", () => {
    it("renders logout", () => {
        const { getByText } = renderWithProviders(<SideDrawer />, {wrapper: MemoryRouter});

        const button = getByText(/logout/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    });
});

describe('Button', () => {
    it("should trigger button action", () => {
        render(<Button />);
        const element = screen.getByRole('button');
        expect(element).toBeInTheDocument();
        fireEvent.click(element);
    });
});

describe('Side Drawer Button', () => {
    it("should trigger side drawer button action", () => {
        render(<SideDrawerButton />);
        const element = screen.getByRole('button');
        expect(element).toBeInTheDocument();
        fireEvent.click(element);
    });
});

test('NavBar', async () => {
    renderNavbar(<NavBar />);
    const element = await screen.findAllByRole("navbar-link")
    expect(element).toHaveLength(2)
})

describe("drawer button from navbar", () => {
    it("should trigger drawer button action", () => {
        renderNavbar(<NavBar />);
        const element = screen.getByTitle('icon');
        expect(element).toBeInTheDocument();
        fireEvent.click(element);
    });
});