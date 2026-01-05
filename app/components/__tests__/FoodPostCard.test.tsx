import { render, screen, fireEvent } from "@testing-library/react";
import { FoodPostCard, FoodPost } from "../FoodPostCard";

const mockPost: FoodPost = {
  id: "1",
  foodName: "Nasi Goreng Spesial",
  description: "Nasi goreng sisa acara kantor, masih fresh dan enak.",
  imageUrl: "https://example.com/image.jpg",
  location: "Jakarta Selatan",
  postedTime: "30 menit yang lalu",
  status: "available",
  quantity: "8-10 porsi",
  giverName: "Budi Santoso",
  giverAvatar: "https://example.com/avatar.jpg",
  category: "Makanan Berat",
};

describe("FoodPostCard", () => {
  const mockOnContact = jest.fn();
  const mockOnLike = jest.fn();
  const mockOnViewDetail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders post information correctly", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByText("Nasi Goreng Spesial")).toBeInTheDocument();
    expect(screen.getByText("Nasi goreng sisa acara kantor, masih fresh dan enak.")).toBeInTheDocument();
    expect(screen.getByText("Jakarta Selatan")).toBeInTheDocument();
    expect(screen.getByText("30 menit yang lalu")).toBeInTheDocument();
    expect(screen.getByText("Porsi: 8-10 porsi")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Makanan Berat")).toBeInTheDocument();
  });

  it("displays available status badge", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByText("Tersedia")).toBeInTheDocument();
  });

  it("displays claimed status badge", () => {
    const claimedPost = { ...mockPost, status: "claimed" as const };
    render(
      <FoodPostCard
        post={claimedPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.getByText("Sudah Diambil")).toBeInTheDocument();
  });

  it("calls onLike when like button is clicked", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    // Find like button by finding button with Heart icon
    const buttons = screen.getAllByRole("button");
    const likeButton = buttons.find((btn) => {
      const svg = btn.querySelector('svg');
      return svg && svg.getAttribute('class')?.includes('lucide-heart');
    });
    
    expect(likeButton).toBeInTheDocument();
    if (likeButton) {
      fireEvent.click(likeButton);
      expect(mockOnLike).toHaveBeenCalledWith("1");
      expect(mockOnLike).toHaveBeenCalledTimes(1);
    }
  });

  it("shows liked state when isLiked is true", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={true}
        onViewDetail={mockOnViewDetail}
      />
    );

    // Find like button by finding button with Heart icon
    const buttons = screen.getAllByRole("button");
    const likeButton = buttons.find((btn) => {
      const svg = btn.querySelector('svg');
      return svg && svg.getAttribute('class')?.includes('lucide-heart');
    });
    
    expect(likeButton).toBeInTheDocument();
    if (likeButton) {
      expect(likeButton).toHaveClass("text-red-500");
    }
  });

  it("calls onContact when contact button is clicked for available post", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    const contactButton = screen.getByRole("button", { name: /hubungi/i });
    expect(contactButton).toBeInTheDocument();
    fireEvent.click(contactButton);

    expect(mockOnContact).toHaveBeenCalledWith(mockPost);
    expect(mockOnContact).toHaveBeenCalledTimes(1);
  });

  it("does not show contact button for claimed post", () => {
    const claimedPost = { ...mockPost, status: "claimed" as const };
    render(
      <FoodPostCard
        post={claimedPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    expect(screen.queryByRole("button", { name: /hubungi/i })).not.toBeInTheDocument();
  });

  it("calls onViewDetail when detail button is clicked", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    const detailButton = screen.getByRole("button", { name: /detail/i });
    fireEvent.click(detailButton);

    expect(mockOnViewDetail).toHaveBeenCalledWith(mockPost);
    expect(mockOnViewDetail).toHaveBeenCalledTimes(1);
  });

  it("renders image with correct src and alt", () => {
    render(
      <FoodPostCard
        post={mockPost}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
        onViewDetail={mockOnViewDetail}
      />
    );

    const image = screen.getByAltText("Nasi Goreng Spesial");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });
});

