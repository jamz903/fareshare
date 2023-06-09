import { screen } from "@testing-library/react";
import SideDrawer from "../components/SideDrawer/SideDrawer";
import { renderWithProviders } from "../../utils/utils-for-tests";

test("renders drawer", async () => {
    renderWithProviders(<SideDrawer />);
    const element = await screen.findAllByRole("button");
    expect(element).toHaveLength(6);
});