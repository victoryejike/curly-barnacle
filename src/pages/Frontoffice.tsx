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
import { Toaster } from "react-hot-toast";
import Logo from "../assets/bukkahut.svg";
import notification from "@/assets/audio/mixkit-happy-bells-notification-937.wav";

// import { useSnapshot } from "valtio";
// import { state } from "@/state";
import { useCallback, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);
import {
  getFirestore,
  doc,
  // getDoc,
  setDoc,
  onSnapshot,
  Timestamp,
  // query,
  // collection,
  // where,
} from "firebase/firestore";

import ChatRoom from "@/components/ChatRoom";

const Frontoffice = () => {
  // const snap = useSnapshot(state);
  const db = getFirestore();
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);

  const [orders, setOrders] = useState<any>([]);
  const handleCountdownFinish = useCallback(
    async (id: string) => {
      const updatedOrders: any = orders.map((order: any) => {
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

      await setDoc(doc(db, "orders", currentUser.location), {
        updatedOrders,
      });
    },
    [orders, currentUser.location]
  );

  const getOrder = (orderInfo: any) => {
    return Object.values(orderInfo)
      .filter((item: any) => item.item !== "")
      .map((item: any) => item.item)
      .join(", ");
  };

  useEffect(() => {
    const ordersCollectionRef = doc(db, "orders", currentUser.location);
    const orderNotif = new Audio(notification);

    const unsubscribe = onSnapshot(ordersCollectionRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        Timestamp;
        if (data && Array.isArray(data.updatedOrders)) {
          const newCount = JSON.parse(localStorage.getItem("orderCount")!);
          data.updatedOrders.length > newCount ? orderNotif.play() : null;
          localStorage.setItem(
            "orderCount",
            JSON.stringify(data.updatedOrders.length)
          );
          setOrders(data.updatedOrders);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser.location, db, orders.length]);

  if (
    orders &&
    orders.filter((orderData: any) => orderData.isExpired === false).length < 1
  ) {
    return (
      <>
        <div className="flex flex-col-reverse justify-between">
          <div className="h-screen flex justify-center items-center grow border border-orange-400 rounded-lg">
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
            <TableHead>Number of Orders</TableHead>
            <TableHead className="">Order</TableHead>
            <TableHead className="">Ready in</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders
              .filter((orderData: any) => orderData.isExpired === false)
              .map((invoice: any) => (
                <TableRow key={nanoid()}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerInfo.customerName}</TableCell>
                  <TableCell>{invoice.orderNumber || 1}</TableCell>
                  <TableCell>{getOrder(invoice.orderInfo)}</TableCell>
                  <TableCell>
                    <CountdownTimer
                      waitTime={invoice.orderInfo.waitTime}
                      onCountdownFinish={() =>
                        handleCountdownFinish(invoice.id)
                      }
                      identifier={invoice.id}
                      data={orders}
                      setData={setOrders}
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
      <Toaster />
    </div>
  );
};

export default Frontoffice;
