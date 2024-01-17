import { Check } from "lucide-react";

import { useSnapshot } from "valtio";
import { state } from "@/state";
// import toast from "react-hot-toast";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdef", 10);

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

type CardProps = React.ComponentProps<typeof Card>;

const OrderSummary = ({ className, ...props }: CardProps) => {
  const snap = useSnapshot(state);
  const handleClick = () => {
    state.data.push(state.order);
    localStorage.setItem("orders", JSON.stringify(snap.data));
    console.log(snap.data);
    state.submitted = true;
    state.showPreview = false;
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
  };
  return (
    <Card className={cn("w-full", className)} {...props}>
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
      <CardFooter>
        <Button className="w-full bg-orange-500" onClick={handleClick}>
          <Check className="mr-2 h-4 w-4" /> Order
        </Button>
        <Button className="w-full mt-3"> Refresh</Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
