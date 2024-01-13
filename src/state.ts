import { proxy } from "valtio";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

export const state = proxy({
  order: {},
  data: [],
  showPreview: false,
  summary: [
    {
      title: "Order ID.",
      description: `#${nanoid(7)}`,
    },
    {
      title: "Customer Name",
      description: "-",
    },
    {
      title: "No of Items",
      description: "-",
    },
    {
      title: "Subtotal",
      description: "-",
    },
    {
      title: "Total",
      description: "-",
    },
  ],
});
