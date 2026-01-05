import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../dialog-custom";

describe("Dialog", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.classList.remove("dialog-open");
  });

  afterEach(() => {
    document.body.classList.remove("dialog-open");
  });

  it("does not render when open is false", () => {
    render(
      <Dialog open={false} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass("dialog-open");
  });

  it("renders when open is true", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(document.body).toHaveClass("dialog-open");
  });

  it("adds dialog-open class to body when opened", () => {
    const { rerender } = render(
      <Dialog open={false} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(document.body).not.toHaveClass("dialog-open");

    rerender(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(document.body).toHaveClass("dialog-open");
  });

  it("removes dialog-open class from body when closed", () => {
    const { rerender } = render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(document.body).toHaveClass("dialog-open");

    rerender(
      <Dialog open={false} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(document.body).not.toHaveClass("dialog-open");
  });

  it("calls onOpenChange when close button is clicked", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange when overlay is clicked", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it("renders DialogTitle correctly", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders DialogDescription correctly", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("uses custom onClose prop when provided", () => {
    const mockOnClose = jest.fn();
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent onClose={mockOnClose}>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });
});

