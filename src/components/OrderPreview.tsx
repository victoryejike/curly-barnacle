import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideTrash2 } from "lucide-react";
import { useSnapshot } from "valtio";
import { state } from "@/state";
import { Button } from "./ui/button";

const invoices = [
  {
    Qty: 2,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 4,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 6,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 1,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 9,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 5,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
  {
    Qty: 3,
    Order: "Local Rice Long grain rice cooked in tomato paste",
    unitPrice: "$250.00",
    subtotal: "$550.00",
  },
];

const OrderPreview = () => {
  const snap = useSnapshot(state);

  const handleClick = () => {
    state.showPreview = false;
  };
  return (
    <div className={`p-8 pb-5 ${snap.showPreview ? "block" : "hidden"}`}>
      <div className="flex items-center justify-between italic">
        <p>Order preview</p>
        <p className="text-red-500">Clear All</p>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Qty</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Unit price (₦)</TableHead>
            <TableHead className="text-right">Subtotal (₦)</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.Qty}>
              <TableCell className="font-medium">
                <div className="flex justify-between items-center">
                  <button className="text-lg bg-[#F5F7FA] font-semibold w-6 h-6 flex justify-center items-center">
                    -
                  </button>
                  <p className="px-2">{invoice.Qty}</p>
                  <button className="text-lg bg-[#F5F7FA] font-semibold w-6 h-6 flex justify-center items-center">
                    +
                  </button>
                </div>
              </TableCell>
              <TableCell>{invoice.Order}</TableCell>
              <TableCell>{invoice.unitPrice}</TableCell>
              <TableCell className="text-right">{invoice.subtotal}</TableCell>
              <TableCell className="text-right text-red-400 w-4 h-4 cursor-pointer">
                <LucideTrash2 />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Button className="mt-6" onClick={handleClick} type="button">
        Go back
      </Button>
    </div>
  );
};

export default OrderPreview;
