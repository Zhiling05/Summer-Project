// src/tests/unit_tests/roles/optometrist_tests/sidebar/ContactPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ContactPage from "../../../../../pages/sidebar/ContactPage";

// 用 mock Header 渲染 .nhs-header（和页面一致的类名）
jest.mock("../../../../../components/Header", () =>
  ({ title }: { title: string }) => (
    <div className="nhs-header" data-testid="header">{title}</div>
  )
);
jest.mock("../../../../../components/BackButton", () => () => (
  <div data-testid="back-btn">Go back</div>
));

describe("ContactPage", () => {
  test("基础渲染：标题/分区/链接", () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("header"))
      .toHaveTextContent("Follow Us");
    expect(screen.getByTestId("back-btn"))
      .toHaveTextContent("Go back");

    expect(
      screen.getByRole("heading", { name: "Contact Us" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "About Our Team" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Contact Information" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Support Hours" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The DIPP is led by a team/i)
    ).toBeInTheDocument();

    // 社媒链接
    expect(screen.getByRole("link", { name: "Youtube" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bluesky" }))
      .toBeInTheDocument();
  });

  test("根据 header 高度设置 paddingTop", () => {
    // 在渲染前塞一个假的 .nhs-header，指定 offsetHeight
    const dummy = document.createElement("div");
    dummy.className = "nhs-header";
    Object.defineProperty(dummy, "offsetHeight", { value: 80 });
    document.body.appendChild(dummy);

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const container = document.querySelector(
      ".contact-page-container"
    ) as HTMLElement;

    expect(container).toHaveStyle({ paddingTop: "80px" });

    document.body.removeChild(dummy);
  });

  test("外部链接包含 target=_blank 与 rel=noopener", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const yt = screen.getByRole("link", { name: "Youtube" });
    const li = screen.getByRole("link", { name: "LinkedIn" });
    const bs = screen.getByRole("link", { name: "Bluesky" });

    expect(yt.getAttribute("target")).toBe("_blank");
    expect(li.getAttribute("target")).toBe("_blank");
    expect(bs.getAttribute("target")).toBe("_blank");

    expect(yt.getAttribute("rel")).toContain("noopener");
    expect(li.getAttribute("rel")).toContain("noopener");
    expect(bs.getAttribute("rel")).toContain("noopener");

    await user.click(yt); // 简单触达一下交互
  });
});
