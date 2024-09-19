import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange: onChange,
    };
  };

  it("should rendered ", () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });
  it("should call onChange cb when enter", async () => {
    const { input, onChange, user } = renderSearchBox();
    const term = "Search";

    await user.type(input, term + "{enter}");

    expect(onChange).toHaveBeenCalledWith(term);
    expect(onChange).toHaveBeenCalledOnce();
  });
  it("should not call onChange cb when enter if empty", async () => {
    const { input, onChange, user } = renderSearchBox();
    const term = "";

    await user.type(input, term + "{enter}");

    expect(onChange).not.toHaveBeenCalledWith(term);
  });
});
