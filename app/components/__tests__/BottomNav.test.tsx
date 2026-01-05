import { render, screen } from "@testing-library/react";
import { BottomNav } from "../BottomNav";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("BottomNav", () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders all navigation items", () => {
    render(<BottomNav />);

    // Check by text content instead of aria-label (mock Link may not preserve aria-label)
    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Cari")).toBeInTheDocument();
    expect(screen.getByText("Buat Post")).toBeInTheDocument();
    expect(screen.getByText("Profil")).toBeInTheDocument();
  });

  it("renders navigation labels", () => {
    render(<BottomNav />);

    expect(screen.getByText("Beranda")).toBeInTheDocument();
    expect(screen.getByText("Cari")).toBeInTheDocument();
    expect(screen.getByText("Buat Post")).toBeInTheDocument();
    expect(screen.getByText("Profil")).toBeInTheDocument();
  });

  it("has correct hrefs for navigation items", () => {
    render(<BottomNav />);

    const homeLink = screen.getByText("Beranda").closest("a");
    const searchLink = screen.getByText("Cari").closest("a");
    const newPostLink = screen.getByText("Buat Post").closest("a");
    const profileLink = screen.getByText("Profil").closest("a");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(searchLink).toHaveAttribute("href", "/search");
    expect(newPostLink).toHaveAttribute("href", "/posts/new");
    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  it("highlights active route", () => {
    mockUsePathname.mockReturnValue("/profile");
    render(<BottomNav />);

    const profileLink = screen.getByText("Profil").closest("a");
    expect(profileLink).toBeInTheDocument();
    
    // Check if icon has green color (active state)
    const icon = profileLink?.querySelector("svg");
    expect(icon).toHaveClass("text-green-600");
  });

  it("shows active indicator for current route", () => {
    mockUsePathname.mockReturnValue("/search");
    const { container } = render(<BottomNav />);

    const searchLink = screen.getByText("Cari").closest("a");
    expect(searchLink).toBeInTheDocument();
    
    // Check for active indicator (green bar at bottom)
    const activeIndicators = container.querySelectorAll(".bg-green-600.rounded-t-full");
    expect(activeIndicators.length).toBeGreaterThan(0);
  });

  it("has mobile-only class", () => {
    const { container } = render(<BottomNav />);
    const nav = container.querySelector("nav");
    
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("block");
    expect(nav).toHaveClass("md:hidden");
  });

  it("has fixed positioning", () => {
    const { container } = render(<BottomNav />);
    const nav = container.querySelector("nav");
    
    expect(nav).toHaveClass("fixed", "bottom-0", "left-0", "right-0");
  });

  it("has safe area padding class", () => {
    const { container } = render(<BottomNav />);
    const nav = container.querySelector("nav");
    
    expect(nav).toHaveClass("pb-safe");
  });
});

