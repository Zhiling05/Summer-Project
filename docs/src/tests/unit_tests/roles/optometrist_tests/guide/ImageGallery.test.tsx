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
  test("默认渲染所有图片项", () => {
    render(
      <MemoryRouter>
        <ImageGallery />
      </MemoryRouter>
    );
    // 检查部分已知标题
    expect(screen.getByText(/Cotton wool spots/i)).toBeInTheDocument();
    expect(screen.getByText(/Normal optic disc/i)).toBeInTheDocument();
  });

  test("搜索能过滤图片", async () => {
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

  test("类别筛选只显示对应分类", async () => {
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

  test("空态提示", async () => {
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
