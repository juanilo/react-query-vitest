import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

const limit = 255;

describe("ExpandableText", () => {
  it("should show whole text if receive small text ", () => {
    const smallText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
    render(<ExpandableText text={smallText} />);
    expect(screen.getByText(smallText)).toBeInTheDocument();
  });
  it("should show truncated text", async () => {
    const longText = "a".repeat(limit + 1);
    const truncatedText = longText.substring(0, limit) + "...";
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/more/i);
  });
  it("should show whole text after click on expand", async () => {
    const longText = "a".repeat(limit + 1);

    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    expect(button).toHaveTextContent(/less/i);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });
  it("should collapse text after click on button", async () => {
    const longText = "a".repeat(limit + 1);

    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    expect(button).toHaveTextContent(/less/i);
    await user.click(button);
    expect(button).toHaveTextContent(/more/i);
  });
});
