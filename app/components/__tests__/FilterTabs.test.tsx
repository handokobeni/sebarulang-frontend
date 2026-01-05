import { render, screen, fireEvent } from "@testing-library/react";
import { FilterTabs } from "../FilterTabs";

// Mock window.matchMedia untuk test responsive
const mockMatchMedia = jest.fn();
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

describe("FilterTabs", () => {
  const mockOnCategoryChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: "",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  it("renders all categories in tabs on desktop", () => {
    mockMatchMedia.mockReturnValue({
      matches: true, // Desktop (sm+)
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Semua"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    // Check tabs (buttons) exist - use getAllByText and filter by role
    const semuaButtons = screen.getAllByText("Semua");
    const tabButton = semuaButtons.find((el) => el.getAttribute("data-slot") === "tabs-trigger");
    expect(tabButton).toBeInTheDocument();

    // Check other categories in tabs
    expect(screen.getAllByText("Makanan Berat").some(el => el.getAttribute("data-slot") === "tabs-trigger")).toBe(true);
    expect(screen.getAllByText("Makanan Ringan").some(el => el.getAttribute("data-slot") === "tabs-trigger")).toBe(true);
    expect(screen.getAllByText("Buah & Sayur").some(el => el.getAttribute("data-slot") === "tabs-trigger")).toBe(true);
    expect(screen.getAllByText("Roti & Kue").some(el => el.getAttribute("data-slot") === "tabs-trigger")).toBe(true);
    expect(screen.getAllByText("Minuman").some(el => el.getAttribute("data-slot") === "tabs-trigger")).toBe(true);
  });

  it("renders dropdown select on mobile", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Mobile
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Semua"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByLabelText("Pilih Kategori");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("Semua");
  });

  it("calls onCategoryChange when dropdown value changes", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Mobile
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Semua"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByLabelText("Pilih Kategori");
    fireEvent.change(select, { target: { value: "Makanan Berat" } });

    expect(mockOnCategoryChange).toHaveBeenCalledWith("Makanan Berat");
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
  });

  it("displays selected category in dropdown", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Mobile
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Buah & Sayur"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByLabelText("Pilih Kategori");
    expect(select).toHaveValue("Buah & Sayur");
  });

  it("has all categories as options in dropdown", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Mobile
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Semua"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByLabelText("Pilih Kategori") as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.value);

    expect(options).toEqual([
      "Semua",
      "Makanan Berat",
      "Makanan Ringan",
      "Buah & Sayur",
      "Roti & Kue",
      "Minuman",
    ]);
  });

  it("has touch-friendly dropdown (min 44px height)", () => {
    mockMatchMedia.mockReturnValue({
      matches: false, // Mobile
      media: "(min-width: 640px)",
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <FilterTabs
        selectedCategory="Semua"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const select = screen.getByLabelText("Pilih Kategori");
    expect(select).toHaveClass("min-h-[44px]");
  });
});

