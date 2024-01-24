/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const formSchema: any = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(8, "Required"),
});

const Auth = () => {
  const [type, setType] = useState<string | any>("password");
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleType = () => {
    setType((prevState: string) => {
      if (prevState === "password") {
        return "text";
      } else if (prevState === "text") {
        return "password";
      }
    });
  };

  return (
    <div className="h-[calc(100vh-6rem)] max-w-sm lg:max-w-lg mx-auto grid grid-cols-1 place-items-center">
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type={type} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type === "password" ? (
                <EyeOff
                  className="absolute right-5 top-1/2 cursor-pointer"
                  onClick={handleType}
                />
              ) : (
                <Eye
                  className="absolute right-5 top-1/2 cursor-pointer"
                  onClick={handleType}
                />
              )}
            </div>
            <Button
              className="w-full mt-3 lg:mt-4 py-6 lg:mx-auto text-base lg:text-lg bg-orange-400"
              type="submit"
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default Auth;
