import { render, screen, fireEvent } from "@testing-library/react";
import { ContactDialog } from "../ContactDialog";
import { FoodPost } from "../FoodPostCard";

const mockPost: FoodPost = {
  id: "1",
  foodName: "Nasi Goreng Spesial",
  description: "Nasi goreng sisa acara kantor, masih fresh dan enak.",
  imageUrl: "https://example.com/image.jpg",
  location: "Jakarta Selatan, Kebayoran Baru",
  postedTime: "30 menit yang lalu",
  status: "available",
  quantity: "8-10 porsi",
  giverName: "Budi Santoso",
  category: "Makanan Berat",
};

describe("ContactDialog", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when post is null", () => {
    render(
      <ContactDialog post={null} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByText("Hubungi Giver")).not.toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <ContactDialog post={mockPost} open={false} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByText("Hubungi Giver")).not.toBeInTheDocument();
  });

  it("renders dialog content when open and post is provided", () => {
    render(
      <ContactDialog post={mockPost} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByText("Hubungi Giver")).toBeInTheDocument();
    expect(screen.getByText("Nasi Goreng Spesial")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Jakarta Selatan, Kebayoran Baru")).toBeInTheDocument();
  });

  it("displays post information correctly", () => {
    render(
      <ContactDialog post={mockPost} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByText("Makanan:")).toBeInTheDocument();
    expect(screen.getByText("Giver:")).toBeInTheDocument();
    expect(screen.getByText("Lokasi:")).toBeInTheDocument();
  });

  it("calls onOpenChange when send message button is clicked", () => {
    window.alert = jest.fn();
    render(
      <ContactDialog post={mockPost} open={true} onOpenChange={mockOnOpenChange} />
    );

    const sendButton = screen.getByRole("button", { name: /kirim pesan/i });
    fireEvent.click(sendButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Menghubungi Budi Santoso untuk Nasi Goreng Spesial"
    );
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange when close button is clicked", () => {
    render(
      <ContactDialog post={mockPost} open={true} onOpenChange={mockOnOpenChange} />
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("displays tips information", () => {
    render(
      <ContactDialog post={mockPost} open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(
      screen.getByText(/Untuk menghubungi giver, kamu bisa mengirim pesan langsung/i)
    ).toBeInTheDocument();
  });
});

