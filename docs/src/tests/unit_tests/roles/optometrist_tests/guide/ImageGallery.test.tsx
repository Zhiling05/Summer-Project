import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ImageGallery from "../../../../../pages/optometrist/guide/ImageGallery";

jest.mock("../../../../../components/Header", () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));
jest.mock("../../../../../components/BottomNav", () => () => (
  <div data-testid="bottom-nav">BottomNav</div>
));
jest.mock("../../../../../components/BackButton", () => () => (
  <div data-testid="back-btn">Back</div>
));

describe("ImageGallery", () => {
  test("Render all image items by default", () => {
    render(
      <MemoryRouter>
        <ImageGallery />
      </MemoryRouter>
    );
    // Check some known titles
    expect(screen.getByText(/Cotton wool spots/i)).toBeInTheDocument();
    expect(screen.getByText(/Normal optic disc/i)).toBeInTheDocument();
  });

  test("The search can filter images.", async () => {
    render(
      <MemoryRouter>
        <ImageGallery />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/search images/i);
    await userEvent.clear(input);
    await userEvent.type(input, "drusen");
    expect(screen.getByText(/drusen bodies/i)).toBeInTheDocument();
    expect(screen.queryByText(/cotton wool/i)).not.toBeInTheDocument();
  });

  test("Category filtering only displays the corresponding categories", async () => {
    render(
      <MemoryRouter>
        <ImageGallery />
      </MemoryRouter>
    );
    const select = screen.getByLabelText(/condition type/i);
    await userEvent.selectOptions(select, "normal");
    expect(screen.getByText(/normal optic disc/i)).toBeInTheDocument();
    expect(screen.queryByText(/cotton wool/i)).not.toBeInTheDocument();
  });

  test("Empty state prompt", async () => {
    render(
      <MemoryRouter>
        <ImageGallery />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/search images/i);
    await userEvent.type(input, "xxxx");
    expect(await screen.findByText(/no images found/i)).toBeInTheDocument();
  });
});
