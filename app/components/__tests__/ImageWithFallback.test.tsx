import { render, screen, fireEvent } from "@testing-library/react";
import { ImageWithFallback } from "../ImageWithFallback";

describe("ImageWithFallback", () => {
  it("renders image with correct src and alt", () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByAltText("Test image");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("renders fallback image when error occurs", () => {
    render(
      <ImageWithFallback
        src="https://invalid-url.com/image.jpg"
        alt="Test image"
      />
    );

    const image = screen.getByAltText("Test image");
    
    // Simulate image error
    fireEvent.error(image);

    // After error, should show fallback
    const fallbackImage = screen.getByAltText("Error loading image");
    expect(fallbackImage).toBeInTheDocument();
    expect(fallbackImage).toHaveAttribute("data-original-url", "https://invalid-url.com/image.jpg");
  });

  it("applies custom className", () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class"
      />
    );

    const image = screen.getByAltText("Test image");
    expect(image).toHaveClass("custom-class");
  });
});

