import { render, screen, fireEvent } from "@testing-library/react";
import { PostDetailPage } from "../PostDetailPage";
import { FoodPost } from "../FoodPostCard";

const mockPost: FoodPost = {
  id: "1",
  foodName: "Nasi Goreng Spesial",
  description: "Nasi goreng sisa acara kantor, masih fresh dan enak. Dibuat tadi pagi.",
  imageUrl: "https://example.com/image.jpg",
  location: "Jakarta Selatan, Kebayoran Baru",
  postedTime: "30 menit yang lalu",
  status: "available",
  quantity: "8-10 porsi",
  giverName: "Budi Santoso",
  giverAvatar: "https://example.com/avatar.jpg",
  category: "Makanan Berat",
};

describe("PostDetailPage", () => {
  const mockOnBack = jest.fn();
  const mockOnContact = jest.fn();
  const mockOnLike = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock navigator.share
    Object.assign(navigator, {
      share: jest.fn().mockResolvedValue(undefined),
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders post information correctly", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    expect(screen.getByText("Nasi Goreng Spesial")).toBeInTheDocument();
    expect(screen.getByText("Nasi goreng sisa acara kantor, masih fresh dan enak. Dibuat tadi pagi.")).toBeInTheDocument();
    expect(screen.getByText("30 menit yang lalu")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("8-10 porsi")).toBeInTheDocument();
    expect(screen.getByText("Jakarta Selatan, Kebayoran Baru")).toBeInTheDocument();
    expect(screen.getByText("Makanan Berat")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    const backButton = screen.getByRole("button", { name: /kembali ke feed/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("calls onLike when like button is clicked", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
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
    }
  });

  it("shows liked state when isLiked is true", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={true}
      />
    );

    // Find like button and check if it has the liked class
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
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    const contactButton = screen.getByRole("button", { name: /hubungi pemberi makanan/i });
    fireEvent.click(contactButton);

    expect(mockOnContact).toHaveBeenCalledWith(mockPost);
  });

  it("does not show contact button for claimed post", () => {
    const claimedPost = { ...mockPost, status: "claimed" as const };
    render(
      <PostDetailPage
        post={claimedPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    expect(screen.queryByRole("button", { name: /hubungi pemberi makanan/i })).not.toBeInTheDocument();
    expect(screen.getByText("Makanan ini sudah diambil")).toBeInTheDocument();
  });

  it("displays available status badge", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    expect(screen.getByText("Tersedia")).toBeInTheDocument();
  });

  it("displays tips section", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    expect(screen.getByText("Tips Pengambilan Makanan")).toBeInTheDocument();
    expect(screen.getByText(/Hubungi pemberi makanan terlebih dahulu sebelum datang/i)).toBeInTheDocument();
  });

  it("displays impact section", () => {
    render(
      <PostDetailPage
        post={mockPost}
        onBack={mockOnBack}
        onContact={mockOnContact}
        onLike={mockOnLike}
        isLiked={false}
      />
    );

    expect(screen.getByText("Dampak Berbagi Makanan")).toBeInTheDocument();
    expect(screen.getByText(/Dengan berbagi makanan ini, Anda membantu mengurangi food waste/i)).toBeInTheDocument();
  });
});

