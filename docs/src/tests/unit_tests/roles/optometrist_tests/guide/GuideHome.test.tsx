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

// 确保这个文件一定有 1 个可执行用例
test("smoke: the test runner is alive", () => {
  expect(true).toBe(true);
});

describe("GuideHome", () => {
  test("渲染标题和两张卡片", () => {
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

  test("点击图片库卡片跳转 gallery", async () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText("Reference Image Gallery"));
    expect(mockNavigate).toHaveBeenCalledWith("gallery");
  });

  test("点击教程卡片跳转 tutorial", async () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByText("App Tutorial for Optometrists"));
    expect(mockNavigate).toHaveBeenCalledWith("tutorial");
  });
});
