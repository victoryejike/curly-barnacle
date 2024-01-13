import { Check } from "lucide-react";

import { useSnapshot } from "valtio";
import { state } from "@/state";

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

  //   orderSummaryData[1].description = Object.keys(snap.order);
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
        <Button className="w-full bg-orange-500">
          <Check className="mr-2 h-4 w-4" /> Order
        </Button>
        <Button className="w-full mt-3"> Refresh</Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
