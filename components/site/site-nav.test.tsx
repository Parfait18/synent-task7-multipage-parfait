import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteNav } from "@/components/site/site-nav";

const navigation = vi.hoisted(() => ({ pathname: "/services" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

describe("SiteNav", () => {
  beforeEach(() => {
    navigation.pathname = "/services";
  });

  it("should mark only the current page with aria-current", () => {
    render(<SiteNav />);
    const desktopNav = screen.getByRole("navigation", { name: "Main" });

    expect(within(desktopNav).getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "page");
    for (const label of ["Home", "About", "Contact"]) {
      expect(within(desktopNav).getByRole("link", { name: label })).not.toHaveAttribute("aria-current");
    }
  });

  it("should open the mobile menu from the hamburger and expose its state", async () => {
    const user = userEvent.setup();
    render(<SiteNav />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("link", { name: /Services/ })).toHaveAttribute("aria-current", "page");
  });

  it("should close the mobile menu with Escape and when a link is followed", async () => {
    const user = userEvent.setup();
    render(<SiteNav />);
    const trigger = screen.getByRole("button", { name: "Open menu" });

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: /About/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
