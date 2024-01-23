import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  id: z.string(),
  customerName: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  // .partial()
  // .refine(
  //   ({ breakfast, mainMenu, protein, drinks, additionalItems }) => {
  //     if (
  //       (!breakfast?.item || breakfast.item === "") &&
  //       (!mainMenu?.item || mainMenu.item === "") &&
  //       (!protein?.item || protein.item === "") &&
  //       (!drinks?.item || drinks.item === "") &&
  //       (!additionalItems?.item || additionalItems.item === "")
  //     ) {
  //       toast.error("One of the place order fields must be filled", {
  //         duration: 4000,
  //         position: "top-right",
  //       });
  //       return false;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "One of the fields must be defined",
  //   }
  // )
});

const Auth = () => {
  return (
    <div className="h-screen">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Auth;
