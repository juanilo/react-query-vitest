import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";

describe.skip("ProductForm", () => {
  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    expect(
      await screen.findByRole("textbox", { name: "name" })
    ).toBeInTheDocument();
  });
});
