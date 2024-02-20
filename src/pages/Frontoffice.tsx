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
import { Toaster, toast } from "react-hot-toast";
import Logo from "../assets/bukkahut.svg";

// import { useSnapshot } from "valtio";
// import { state } from "@/state";
import { useCallback, useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);
import {
  getFirestore,
  doc,
  getDoc,
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
  // const [orders, setOrders] = useState<any>([]);
  // const placedOrders = useMemo(
  //   () => JSON.parse(localStorage.getItem("orders")!) || [],
  //   []
  // );
  // const [completedCountdowns, setCompletedCountdowns] = useState<any>([]);

  const handleCountdownFinish = useCallback(async (id: string) => {
    console.log(id);
    await toast.success(`Order with id ${id} is ready`, {
      duration: 4000,
      position: "top-right",
    });
    // setCompletedCountdowns((prevCompletedCountdowns: any) => [
    //   ...prevCompletedCountdowns,
    //   id,
    // ]);
    // const orderObj = JSON.parse(localStorage.getItem("orders")!) || [];
    // Update orderInfo with waitTime set to 0
    // orders.filter((order: any) => order.id !== id);
    // setCompletedCountdowns(updatedOrder);
    // const updatedOrders: any = orders.map((order: any) => {
    //   if (order.id === id) {
    //     return {
    //       ...order,
    //       isExpired: true,
    //     };
    //   }
    //   return order; // Return the unchanged order for other items
    // });

    // const docRef = doc(db, "orders", currentUser.location);
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   const data = docSnap.data();
    //   if (data && Array.isArray(data.updatedOrders)) {
    //     setOrders(
    //       data.updatedOrders.filter(
    //         (orderData: any) => orderData.isExpired === false
    //       )
    //     );
    //   }
    // }
    // localStorage.setItem("orders", JSON.stringify(updatedOrders));
    // setOrders(updatedOrders);
  }, []);

  const getOrder = (orderInfo: any) => {
    return Object.values(orderInfo)
      .filter((item: any) => item.item !== "")
      .map((item: any) => item.item)
      .join(", ");
  };

  useEffect(() => {
    const getMessages = async () => {
      // const ordersCollection = collection(db, "orders", currentUser.location);
      // const expiredOrdersQuery = query(
      //   ordersCollection,
      //   where("isExpired", "==", false)
      // );

      // try {
      //   const querySnapshot = await getDocs(expiredOrdersQuery);
      //   const expiredOrders = querySnapshot.docs.map((doc: any) => doc.data());
      //   setOrders(expiredOrders);
      //   return expiredOrders;
      // } catch (error) {
      //   console.error("Error getting expired orders: ", error);
      //   setOrders([]);
      //   return [];
      // }
      // const q = query(collection(db, "orders", currentUser.location, where()));
      const docRef = doc(db, "orders", currentUser.location);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.updatedOrders)) {
          setOrders(
            data.updatedOrders.filter(
              (orderData: any) => orderData.isExpired === false
            )
          );
        }
      }
    };
    getMessages();
  }, [currentUser.location, db]);

  if (orders && orders.length < 1) {
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
            <TableHead>Status</TableHead>
            <TableHead className="">Order</TableHead>
            <TableHead className="">Ready in</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.map((invoice: any) => (
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
                    data={orders}
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
