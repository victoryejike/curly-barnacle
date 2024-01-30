/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export type Role = {
  cashier?: boolean;
  orderProcessor?: boolean;
  kitchenSupervisor?: boolean;
  auditAssistant?: boolean;
};

// type User = {};

const formSchema: any = z
  .object({
    username: z.string().min(1, "Required"),
    email: z.string().min(1, "Required"),
    password: z.string().min(8, "Required"),
    confirmPassword: z.string().min(8, "Required"),
    role: z.string().min(1, "Required"),
    location: z.string().min(1, "Required"),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) {
        return false;
      }
      return true;
      //   return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const userRoles = [
    "Cashier",
    "Audit Assistant",
    "Kitchen Supervisor",
    "Order processor",
  ];
  const [type, setType] = useState<string | any>("password");
  const [confirmType, setConfirmType] = useState<string | any>("password");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
      location: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, role, location, username } = values;
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      auth.currentUser &&
        (await updateProfile(auth.currentUser, { displayName: username }));
      const user: any = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        location,
        username,
      });

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      const currentUser = docSnap.exists() && docSnap.data();

      localStorage.setItem("user", JSON.stringify(currentUser));
      setLoading(false);
      toast.success("Account created successfully!!");
      navigate("/order");
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred");
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

  const handleConfirmType = () => {
    setConfirmType((prevState: string) => {
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
            <div className="block lg:grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-3 lg:mb-0">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="block lg:grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="mb-3 lg:mb-0">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles.map((rolez) => (
                          <SelectItem key={rolez} value={rolez}>
                            {rolez}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <div className="relative">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type={confirmType}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {confirmType === "password" ? (
                <EyeOff
                  className="absolute right-5 top-1/2 cursor-pointer"
                  onClick={handleConfirmType}
                />
              ) : (
                <Eye
                  className="absolute right-5 top-1/2 cursor-pointer"
                  onClick={handleConfirmType}
                />
              )}
            </div>
            <Button
              className="w-full mt-3 lg:mt-4 py-6 lg:mx-auto text-base lg:text-lg bg-orange-400"
              type="submit"
            >
              {loading ? <p>Loading...</p> : <p>Sign up</p>}
            </Button>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium underline underline-offset-2 text-orange-400"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default Auth;
