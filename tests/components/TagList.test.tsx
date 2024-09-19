import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render", async () => {
    render(<TagList />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    // await waitFor(() => {
    //   const items = screen.getAllByRole("listitem");
    //   expect(items.length).toBeGreaterThan(0);
    // });

    // findAllBy - is getBy but using waitFor
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
});
