import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";

describe("ProductList", () => {
  const renderComponent = () => {
    render(<ProductList />, { wrapper: AllProviders });
  };

  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });
  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render a list of Products", async () => {
    renderComponent();

    const items = await screen.findAllByRole("listitem");
    expect(items.length).greaterThan(0);
  });
  it("should render a message when there are no products", async () => {
    server.use(http.get("/products", () => HttpResponse.json([])));
    renderComponent();

    const message = await screen.findByText(/no products /i);
    expect(message).toBeInTheDocument();
  });
  it("should render an error message when there is an error", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });
  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
  it("should remove the loading indicator after successful fetch", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it("should remove the loading indicator after failed fetch", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));
    renderComponent();
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
