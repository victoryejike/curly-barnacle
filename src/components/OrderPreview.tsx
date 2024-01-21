/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import { LucideTrash2 } from "lucide-react";
import { useSnapshot } from "valtio";
import { state } from "@/state";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

// const invoices = [
//   {
//     Qty: 2,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 4,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 6,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 1,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 9,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 5,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
//   {
//     Qty: 3,
//     Order: "Local Rice Long grain rice cooked in tomato paste",
//     unitPrice: "$250.00",
//     subtotal: "$550.00",
//   },
// ];

const OrderPreview = () => {
  const snap = useSnapshot(state);
  const orderInfo: any = snap.order;
  const [total, setTotal] = useState(0);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [newOrderInfo, setNewOrderInfo] = useState<any>(null);

  useEffect(() => {
    if (orderInfo && orderInfo.orderInfo) {
      setNewOrderInfo(state.order);
      const orderItems: any = Object.keys(orderInfo.orderInfo)
        .filter((key) => key !== "waitTime")
        .filter((item) => orderInfo.orderInfo[item].item.trim() !== "");

      // Calculate total price
      const totalPrice = orderItems.reduce((total: any, item: any): any => {
        console.log(orderItems);
        return (
          total +
          orderInfo.orderInfo[item].price * orderInfo.orderInfo[item].quantity
        );
      }, 0);

      setOrderDetails(orderItems);

      setTotal(totalPrice);
    }
  }, [orderInfo, newOrderInfo]);

  const handleUpdateQuantity = (itemName: any, newQuantity: number = 1) => {
    console.log(itemName, newQuantity);
    // const copyOrderInfo: any = { ...newOrderInfo };

    setNewOrderInfo((prevOrderInfo: any) => {
      if (prevOrderInfo && prevOrderInfo.orderInfo) {
        // Ensure that the specified item exists in orderInfo
        const currentItem = prevOrderInfo.orderInfo[itemName];
        if (currentItem) {
          // Create a shallow copy of the orderInfo object
          const copyInfo: any = { ...prevOrderInfo };

          // Update the quantity for the specified item
          copyInfo.orderInfo[itemName] = {
            ...currentItem,
            quantity: newQuantity,
          };

          return copyInfo;
        }
      }

      // Return the previous state if something is undefined
      return prevOrderInfo;
      //   if (
      //     prevOrderInfo &&
      //     prevOrderInfo.orderInfo &&
      //     prevOrderInfo.orderInfo[itemName]
      //   ) {
      //     // Create a shallow copy of the orderInfo object
      //     const copyInfo: any = { ...prevOrderInfo };

      //     // Update the quantity for the specified item
      //     copyInfo.orderInfo[itemName] = {
      //       ...copyInfo.orderInfo[itemName],
      //       quantity: ++newQuantity,
      //     };

      //     return newOrderInfo;
      //   }
    });
  };

  const handleClick = () => {
    state.showPreview = false;
    state.formStep = 0;
  };

  const handleForwardClick = () => {
    state.formStep = 2;
  };
  return (
    <div className={`p-8 pb-5 ${snap.formStep === 1 ? "block" : "hidden"}`}>
      <div className="flex items-center justify-between italic">
        <p>Order preview</p>
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Qty</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Unit price (₦)</TableHead>
            <TableHead className="text-right">Subtotal (₦)</TableHead>
            {/* <TableHead className="text-right"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderDetails &&
            orderDetails.map((item: any) => (
              <TableRow key={item}>
                <TableCell className="font-medium">
                  <div className="flex justify-between items-center">
                    <button className="text-lg bg-[#F5F7FA] font-semibold w-6 h-6 flex justify-center items-center">
                      -
                    </button>
                    <p className="px-2">{orderInfo.orderInfo[item].quantity}</p>
                    <button
                      onClick={() => handleUpdateQuantity(item, 1)}
                      className="text-lg bg-[#F5F7FA] font-semibold w-6 h-6 flex justify-center items-center"
                    >
                      +
                    </button>
                  </div>
                </TableCell>
                <TableCell>{orderInfo.orderInfo[item].item}</TableCell>
                <TableCell>{orderInfo.orderInfo[item].price}</TableCell>
                <TableCell className="text-right">
                  {orderInfo.orderInfo[item].price *
                    orderInfo.orderInfo[item].quantity}
                </TableCell>
                {/* <TableCell className="text-right text-red-400 w-4 h-4 cursor-pointer">
                  <LucideTrash2 />
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-2xl">
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">₦ {total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-between items-center">
        <Button className="mt-6" onClick={handleClick} type="button">
          Go back
        </Button>
        <Button className="mt-6" onClick={handleForwardClick} type="button">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OrderPreview;
