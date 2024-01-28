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
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const formSchema: any = z.object({
  email: z.string().min(1, "Required"),
  password: z.string().min(8, "Required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string | any>("password");
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const { email, password } = values;
    setLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(userCredentials);
      const user: any = userCredentials.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.accessToken);
      toast.success("Login successful!!");
      navigate("/order");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
      setLoading(false);
    }
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
              name="email"
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
              {loading ? <p>Loading...</p> : <p>Log in</p>}
            </Button>
            <p className="text-center">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="underline underline-offset-2 text-orange-400"
              >
                Create Account
              </Link>
            </p>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
