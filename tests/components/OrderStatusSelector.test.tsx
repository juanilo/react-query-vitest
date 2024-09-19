import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";

describe("OrderStatusSelector", () => {
  // beforeAll(() => {
  //   global.ResizeObserver = class ResizeObserver {
  //     observe() {
  //       // do nothing
  //     }
  //     unobserve() {
  //       // do nothing
  //     }
  //     disconnect() {
  //       // do nothing
  //     }
  //   };
  // no recommended way to mock ResizeObserver
  // instead of that use rezize-observer-polyfill lib
  // and setup in setup.ts file for vitest
  // });

  const renderOrderStatusSelector = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      select: screen.getByRole("combobox"),
      user: userEvent.setup(),
      onChange: onChange,
      getOptions: () => screen.findAllByRole("option"), //delayed to be rendered
    };
  };

  it("should render", async () => {
    const { select, user, getOptions } = renderOrderStatusSelector();

    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent(/new/i);

    await user.click(select);

    // const options = await screen.findAllByRole("option");
    const options = await getOptions();
    const labels = options.map((o) => o.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
  it("should render combobox with selected option", async () => {
    const { select, user, getOptions } = renderOrderStatusSelector();

    await user.click(select);

    // const options = await screen.findAllByRole("option");
    const options = await getOptions();
    const labels = options.map((o) => o.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
  it("should pass the selected text to the callback", async () => {
    const { select, user, onChange } = renderOrderStatusSelector();
    await user.click(select);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ["New", "Processed", "Fulfilled", "New"].forEach(async (text) => {
      const option = await screen.findByRole("option", { name: text });
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(text);
    });
  });
  // it.each([
  //   {
  //     label: /processed/i,
  //     value: "processed",
  //   },
  //   {
  //     label: /fulfilled/i,
  //     value: "fulfilled",
  //   },
  // ])(
  //   "should pass $value selected text to the callback",
  //   async ({ label, value }) => {
  //     const { select, user, onChange } = renderOrderStatusSelector();
  //     await user.click(select);

  //     const option = await screen.findByRole("option", { name: label });
  //     await user.click(option);

  //     expect(onChange).toHaveBeenCalledWith(value);
  //   }
  // );
});
