/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check } from "lucide-react";

import { useSnapshot } from "valtio";
import { state } from "@/state";
// import toast from "react-hot-toast";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);
import { Toaster, toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

type CardProps = React.ComponentProps<typeof Card>;

const OrderSummary = ({ className, ...props }: CardProps) => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const db = getFirestore();
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);
  const handleRefresh = () => {
    state.order = {};
    state.formStep = 0;
  };

  useEffect(() => {
    const getMessages = async () => {
      const docRef = doc(db, "orders", currentUser.location);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.updatedOrders)) {
          setOrders(data.updatedOrders);
        }
      }
    };
    getMessages();
  }, [currentUser.location, db, snap.showDelete]);

  const handleClick = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")!);

    // const storedOrders = JSON.parse(localStorage.getItem("orders")!) || [];
    const updatedOrders = [...orders, state.order];

    const docRef = doc(db, "orders", user.location);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(doc(db, "orders", user.location), { updatedOrders });
      setLoading(false);
    } else {
      await setDoc(doc(db, "orders", user.location), {
        updatedOrders,
      });
      setLoading(false);
    }

    await toast.success("Order created successfully", {
      duration: 4000,
      position: "top-right",
    });

    state.submitted = true;
    state.summary = [
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
    // navigate(0);

    navigate("/view");
  };
  return (
    <Card
      className={cn(
        `w-full ${snap.formStep === 1 ? "block" : "hidden"}`,
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Summary of customer order.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {snap.summary.map((data, index) => (
            <div
              key={index}
              className="mb-4 items-start pb-4 last:mb-0 border-b "
            >
              <div className="space-y-1 flex justify-between items-center">
                <p className="text-sm font-medium leading-none">{data.title}</p>
                <p className="text-sm text-muted-foreground">
                  {data.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="w-full lg:w-3/5 mx-auto grid grid-cols-2 gap-3 justify-center">
        <Button className="w-full" onClick={handleRefresh}>
          {" "}
          Refresh
        </Button>
        <Button className="w-full bg-orange-500" onClick={handleClick}>
          <Check className="mr-2 h-4 w-4" /> {loading ? "loading..." : "Order"}
        </Button>
      </CardFooter>
      <Toaster />
    </Card>
  );
};

export default OrderSummary;
