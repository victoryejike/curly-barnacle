/* eslint-disable @typescript-eslint/no-explicit-any */
import { proxy } from "valtio";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

export const summaryInitialValues = [
  {
    title: "Order ID.",
    description: `#${nanoid(7)}`,
  },
  {
    title: "Customer Name",
    description: "-",
  },
  {
    title: "Wait time",
    description: "-",
  },
  {
    title: "Subtotal",
    description: 0,
  },
  {
    title: "Total",
    description: 0,
  },
];

export const state = proxy({
  order: {},
  data: [] as any[],
  formStep: 0,
  showPreview: false,
  submitted: false,
  summary: summaryInitialValues,
});
