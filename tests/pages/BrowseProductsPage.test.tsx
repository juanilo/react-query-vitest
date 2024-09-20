import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import BrowseProductsPage from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import { CartProvider } from "../../src/providers/CartProvider";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(
        db.category.create({ name: `Category ${Math.random()}` })
      );
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProductsPage />
        </Theme>
      </CartProvider>
    );

    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.queryByRole("progressbar", { name: /categories/i }),
    };
  };

  it("should show loading skeleton when fetch categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetch categories", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(getCategoriesSkeleton()).not.toBeInTheDocument();
  });
  it("should show loading skeleton when fetch products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });
  it("should hide loading skeleton after fetch products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    expect(getProductsSkeleton()).not.toBeInTheDocument();
  });

  it("should not show error when categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

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

  it("should render categories", async () => {
    renderComponent();
    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
