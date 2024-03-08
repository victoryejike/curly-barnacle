/* eslint-disable @typescript-eslint/no-explicit-any */
import { proxy } from "valtio";

export const summaryInitialValues = [
  {
    title: "Order ID.",
    description: "",
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
  order: {} as any,
  data: [] as any[],
  user: null as any,
  formStep: 0,
  showPreview: false,
  submitted: false,
  showDelete: false,
  summary: summaryInitialValues,
});
