import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { after, before } from "node:test";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";

describe("ProductDetail", () => {
  const renderComponent = (id: number) => {
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
  };

  it("should render a ProductDetail", async () => {
    before(() => {
      db.product.create({ id: 1 });
    });
    after(() => {
      db.product.delete({ where: { id: { equals: 1 } } });
    });

    renderComponent(1);

    const product = db.product.findFirst({ where: { id: { equals: 1 } } });

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });
  it("should render a message when there are no product", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));
    renderComponent(1);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });
  it("should render an error for invalid product id", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));
    renderComponent(0);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });
  it("should render an error for invalid product id", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    renderComponent(0);

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponent(1);
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
  it("should remove the loading indicator after successful fetch", async () => {
    renderComponent(1);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it("should remove the loading indicator after failed fetch", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    renderComponent(1);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
