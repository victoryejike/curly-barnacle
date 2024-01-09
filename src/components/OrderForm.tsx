import * as z from "zod";
import { useForm } from "react-hook-form";

// UI IMPORTS
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  customerName: z.string({ required_error: "Customer name is required" }),
  phone: z.string({ required_error: "Customer phone number is required" }),
  breakfast: z.string(),
  mainMenu: z.string(),
  protein: z.string(),
  drinks: z.string(),
  additionalItems: z.string(),
  waitTime: z.number({ required_error: "Estimated time is required" }),
});

const OrderForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      breakfast: "",
      mainMenu: "",
      protein: "",
      drinks: "",
      additionalItems: "",
      waitTime: 0,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <p className="text-2xl font-semibold">Customer Details</p>
          <div className="flex justify-between items-center w-full">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="customer name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="enter phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is for customer phone number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-2xl font-semibold">Place Order</p>
          <div className="flex justify-between items-center w-full">
            <FormField
              control={form.control}
              name="breakfast"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
                  <FormLabel>Breakfast</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="" {...field}>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainMenu"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
                  <FormLabel>Main menu</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="" {...field}>
                        <SelectValue placeholder="Select Main menu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is for customer phone number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <FormField
              control={form.control}
              name="protein"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
                  <FormLabel>Protein</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="" {...field}>
                        <SelectValue placeholder="Select Protein" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="drinks"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
                  <FormLabel>Drinks</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="" {...field}>
                        <SelectValue placeholder="Select Drinks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is for customer phone number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <FormField
              control={form.control}
              name="additionalItems"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
                  <FormLabel>Additonal Items</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="" {...field}>
                        <SelectValue placeholder="Select additional items" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="waitTime"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
                  <FormLabel>Estimated time (min)</FormLabel>
                  <FormControl>
                    <Input placeholder="enter estimated time" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is for estimated time in minutes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
