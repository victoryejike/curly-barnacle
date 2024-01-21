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
import CountdownTimer from "@/components/CountdownTimer";

// import { useSnapshot } from "valtio";
// import { state } from "@/state";
import { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { LucideTrash2 } from "lucide-react";
const nanoid = customAlphabet("1234567890abcdef", 10);

const Frontoffice = () => {
  // const snap = useSnapshot(state);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const placedOrders = JSON.parse(localStorage.getItem("orders")!) || [];
    console.log(placedOrders);
    setOrders(placedOrders);
  }, []);

  const handleCountdownFinish = (id: string) => {
    // Update orderInfo with waitTime set to 0
    const updatedOrders: any = orders.filter((order: any) => order.id !== id);
    // const updatedOrders: any = orders.map((order: any) => {
    //   if (order.id === id) {
    //     // return {
    //     //   ...order,
    //     //   orderInfo: {
    //     //     ...order.orderInfo,
    //     //     waitTime: 0,
    //     //   },
    //     // };
    //   }
    //   return order; // Return the unchanged order for other items
    // });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };
  return (
    <div className="pt-4">
      <Table>
        <TableCaption>A list of your recent Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="">Order</TableHead>
            <TableHead className="">Ready in</TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((invoice: any) => (
            <TableRow key={nanoid()}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.customerInfo.customerName}</TableCell>
              <TableCell>{invoice.customerInfo.customerName}</TableCell>
              <TableCell>{invoice.customerInfo.customerName}</TableCell>
              <TableCell>
                <CountdownTimer
                  waitTime={invoice.orderInfo.waitTime}
                  onCountdownFinish={() => handleCountdownFinish(invoice.id)}
                  identifier={invoice.id}
                  key={invoice.id}
                />
              </TableCell>
              <TableCell className="text-right">
                <LucideTrash2 className="text-red-400 cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Frontoffice;
