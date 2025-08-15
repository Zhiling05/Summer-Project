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
  test("初始渲染", () => {
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
    // 模块标签不显示
    expect(screen.queryByRole("button", { name: /home/i })).not.toBeInTheDocument();
    // Prev 按钮禁用
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  test("点击 Next 进入", async () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    // 显示模块标签
    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
    // 内容来自 home 模块
    expect(
      screen.getByText(/you will return to the role selection/i)
    ).toBeInTheDocument();
  });

  test("模块内切换步骤和模块", async () => {
    render(
      <MemoryRouter>
        <OptAppTutorial />
      </MemoryRouter>
    );
    // 进入教程
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    // 切换到 assess 模块标签
    await userEvent.click(screen.getByRole("button", { name: /assess/i }));
    expect(
      screen.getByText(/Questionnaire Process/i)
    ).toBeInTheDocument();
    // Next 到第二步
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(
      screen.getByText(/Viewing Results/i)
    ).toBeInTheDocument();
    // Prev 返回第一步
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
    // 进入教程
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    // 快速点击 Next 直到 guide 模块最后一步
    const nextBtn = screen.getByRole("button", { name: /next/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.click(nextBtn);
    }
    expect(
      screen.getByRole("button", { name: /complete tutorial/i })
    ).toBeDisabled();
  });
});
