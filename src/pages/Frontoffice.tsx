/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSnapshot } from "valtio";
import { state } from "@/state";
import { useEffect } from "react";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

const Frontoffice = () => {
  const snap = useSnapshot(state);
  useEffect(() => {
    console.log(state.data);
  }, [snap.data]);
  return (
    <div className="pt-4">
      <Table>
        <TableCaption>A list of your recent Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Order</TableHead>
            <TableHead className="text-right">Ready in</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {snap.data.map((invoice: any) => (
            <TableRow key={nanoid()}>
              <TableCell className="font-medium">{invoice.phone}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.breakfast?.item}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell className="text-right">{invoice.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Frontoffice;
