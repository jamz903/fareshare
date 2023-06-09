import React from 'react';
import { render, screen } from "@testing-library/react";
import SideDrawerButton from "../components/SideDrawer/SideDrawerButton";
import Button from "../components/Button";
import RiceBowl from "../components/RiceBowl";

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
