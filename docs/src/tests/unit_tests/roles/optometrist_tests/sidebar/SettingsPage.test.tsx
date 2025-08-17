// src/tests/unit_tests/roles/optometrist_tests/sidebar/SettingsPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SettingsPage from "../../../../../pages/sidebar/SettingsPage";

const mockSetFontSize = jest.fn();

// ⚠️ 注意：这里的 jest.mock 路径要从“测试文件”出发
jest.mock(
  "../../../../../components/Header",
  () =>
    ({ title }: { title: string }) =>
      <div data-testid="header">{title}</div>
);

jest.mock(
  "../../../../../components/BackButton",
  () =>
    () =>
      <div data-testid="back-btn">Go back</div>
);

// 用项目中真实文件路径去 mock FontSizeContext，
// 并把 setFontSize 绑定到上面的 mockSetFontSize
jest.mock(
  "../../../../../pages/sidebar/FontSizeContext",
  () => ({
    useFontSize: () => ({
      fontSize: "18px",
      setFontSize: mockSetFontSize,
    }),
  })
);

describe("SettingsPage", () => {
  test("初始渲染", () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("header"))
      .toHaveTextContent("Settings Page");
    expect(screen.getByTestId("back-btn"))
      .toHaveTextContent("Go back");

    expect(
      screen.getByRole("heading", { name: "Settings Page" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Font Size" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Click these buttons/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Small" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Medium" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Large" })
    ).toBeInTheDocument();
  });

  test("点击按钮调用 setFontSize", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Small" }));
    expect(mockSetFontSize).toHaveBeenCalledWith("13px");

    await user.click(screen.getByRole("button", { name: "Medium" }));
    expect(mockSetFontSize).toHaveBeenCalledWith("18px");

    await user.click(screen.getByRole("button", { name: "Large" }));
    expect(mockSetFontSize).toHaveBeenCalledWith("24px");
  });
});
