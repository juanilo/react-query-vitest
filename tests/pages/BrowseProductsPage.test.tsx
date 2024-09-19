import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import BrowseProductsPage from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";

describe("BrowseProductsPage", () => {
  const renderComponent = () =>
    render(
      <Theme>
        <BrowseProductsPage />
      </Theme>
    );

  it("should show loading skeleton when fetch categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetch categories", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
  });
  it("should show loading skeleton when fetch products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetch products", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /products/i })
    );
  });

  it("should not show error when categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /categories/i })
    ).not.toBeInTheDocument();
  });

  it("should show error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
