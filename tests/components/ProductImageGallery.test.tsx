import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should render nothing if receive an empty array", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("should render a list of images", () => {
    const images = [
      "https://picsum.photos/id/1024/3840/2160",
      "https://picsum.photos/id/1035/4800/2700",
    ];
    render(<ProductImageGallery imageUrls={images} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(2);
    images.forEach((url, index) => {
      expect(imgs[index]).toHaveAttribute("src", url);
    });
  });
});
