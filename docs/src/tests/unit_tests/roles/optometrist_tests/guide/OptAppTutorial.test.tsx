import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import OptAppTutorial from "../../../../../pages/optometrist/guide/OptAppTutorial";

jest.mock("../../../../../components/Header", () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));
jest.mock("../../../../../components/BottomNav", () => () => (
  <div data-testid="bottom-nav">BottomNav</div>
));
jest.mock("../../../../../components/BackButton", () => () => (
  <div data-testid="back-btn">Back</div>
));

describe("OptAppTutorial", () => {
  test("Initial rendering", () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    expect(screen.getByTestId("header")).toHaveTextContent(
      "App Tutorial for Optometrists"
    );
    expect(
      screen.getByText(/The optometrist app provides/i)
    ).toBeInTheDocument();
    // Module labels are not displayed
    expect(screen.queryByRole("button", { name: /home/i })).not.toBeInTheDocument();
    // Prev button is disabled
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  test("Click Next to enter", async () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    // Display module labels
    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
    // from home module
    expect(
      screen.getByText(/you will return to the role selection/i)
    ).toBeInTheDocument();
  });

  test("Switch steps and modules within the module", async () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    await userEvent.click(screen.getByRole("button", { name: /assess/i }));
    expect(
      screen.getByText(/Questionnaire Process/i)
    ).toBeInTheDocument();
    // Next to step 2
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(
      screen.getByText(/Viewing Results/i)
    ).toBeInTheDocument();
    // Prev to step 1
    await userEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(
      screen.getByText(/Questionnaire Process/i)
    ).toBeInTheDocument();
  });

  test("Complete Tutorial", async () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    // begin the tutorial
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    //click next to the last step of the tutorial 
    const nextBtn = screen.getByRole("button", { name: /next/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.click(nextBtn);
    }
    expect(
      screen.getByRole("button", { name: /complete tutorial/i })
    ).toBeDisabled();
  });
});
