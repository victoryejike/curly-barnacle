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

import Logo from "../assets/bukkahut.svg";

import { useSnapshot } from "valtio";
import { state } from "@/state";
import { useCallback, useEffect, useMemo, useState } from "react";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);
import { getFirestore, doc, getDoc } from "firebase/firestore";

import ChatRoom from "@/components/ChatRoom";

const Frontoffice = () => {
  const snap = useSnapshot(state);
  const db = getFirestore();
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);

  const [orders, setOrders] = useState<any>([]);
  // const [orders, setOrders] = useState<any>([]);
  const placedOrders = useMemo(
    () => JSON.parse(localStorage.getItem("orders")!) || [],
    []
  );
  // const [completedCountdowns, setCompletedCountdowns] = useState<any>([]);
  console.log(orders);

  const handleCountdownFinish = useCallback(
    (id: string) => {
      // setCompletedCountdowns((prevCompletedCountdowns: any) => [
      //   ...prevCompletedCountdowns,
      //   id,
      // ]);
      // const orderObj = JSON.parse(localStorage.getItem("orders")!) || [];
      // Update orderInfo with waitTime set to 0
      // orders.filter((order: any) => order.id !== id);
      // setCompletedCountdowns(updatedOrder);
      const updatedOrders: any = placedOrders.map((order: any) => {
        if (order.id === id) {
          return {
            ...order,
            orderInfo: {
              ...order.orderInfo,
              waitTime: 0,
            },
          };
        }
        return order; // Return the unchanged order for other items
      });

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      // setOrders(updatedOrders);
    },
    [placedOrders]
  );

  const getOrder = (orderInfo: any) => {
    return Object.values(orderInfo)
      .filter((item: any) => item.item !== "")
      .map((item: any) => item.item)
      .join(", ");
  };

  useEffect(() => {
    const getMessages = async () => {
      const docRef = doc(db, "orders", currentUser.location);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.orders)) {
          setOrders(data.messages);
        }
      }
    };
    getMessages();
  }, [currentUser.location, db, placedOrders, snap.showDelete]);

  if (placedOrders && placedOrders.length < 1) {
    return (
      <>
        <div className="flex flex-col-reverse justify-between">
          <div className="h-screen flex justify-center items-center grow">
            <div className="items-center flex flex-col justify-center">
              <img src={Logo} alt="logo" />
              <p className="pt-4">No order has been added yet.</p>
            </div>
          </div>
          <ChatRoom />
        </div>
      </>
    );
  }

  return (
    <div className="pt-4 flex flex-col-reverse">
      <Table className="w-full">
        <TableCaption>A list of your recent Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="">Order</TableHead>
            <TableHead className="">Ready in</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placedOrders.map((invoice: any) => (
            <TableRow key={nanoid()}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.customerInfo.customerName}</TableCell>
              <TableCell>
                {invoice.orderInfo.waitTime !== 0 ? "In progress" : "Ready"}
              </TableCell>
              <TableCell>{getOrder(invoice.orderInfo)}</TableCell>
              <TableCell>
                <CountdownTimer
                  waitTime={invoice.orderInfo.waitTime}
                  onCountdownFinish={() => handleCountdownFinish(invoice.id)}
                  identifier={invoice.id}
                  data={placedOrders}
                  key={invoice.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full">
        <ChatRoom />
      </div>
    </div>
  );
};

export default Frontoffice;
