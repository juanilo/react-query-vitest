import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = {
      id: 1,
      name: "Juan",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
  it("should render title", () => {
    const user = {
      id: 1,
      name: "Juan",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/User Profile/i);
  });
  it("should render button if user is admin", () => {
    const user: User = {
      id: 1,
      name: "Juan",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Edit/i);
  });
  it("should not render button if user is admin", () => {
    const user: User = {
      id: 1,
      name: "Juan",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
