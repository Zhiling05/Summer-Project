import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import GuideHome from "../../../../../pages/optometrist/guide/GuideHome";

jest.mock("../../../../../components/Header", () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));
jest.mock("../../../../../components/BottomNav", () => () => (
  <div data-testid="bottom-nav">BottomNav</div>
));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return { ...original, useNavigate: () => mockNavigate };
});

afterEach(() => {
  mockNavigate.mockClear();
});

test("smoke: the test runner is alive", () => {
  expect(true).toBe(true);
});

describe("GuideHome", () => {
  test("Render the title and two cards", () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );
    expect(screen.getByTestId("header")).toHaveTextContent("Guide");
    expect(screen.getByText("Reference Image Gallery")).toBeInTheDocument();
    expect(screen.getByText("App Tutorial for Optometrists")).toBeInTheDocument();
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument();
  });

  test("Click the image gallery card to jump gallery", async () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText("Reference Image Gallery"));
    expect(mockNavigate).toHaveBeenCalledWith("gallery");
  });

  test("Click tutorial card to jump tutorial", async () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText("App Tutorial for Optometrists"));
    expect(mockNavigate).toHaveBeenCalledWith("tutorial");
  });
});
