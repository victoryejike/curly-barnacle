/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const scroll = useRef<HTMLDivElement>(null);
  const db = getFirestore();
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (message.trim() === "") {
      toast.error("please enter a valid message");
    }
    await addDoc(collection(db, "messages"), {
      text: message,
      name: currentUser.username,
      createdAt: new Date(),
      email: currentUser.email,
    });
    toast.success("message sent");
    setMessage("");
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages: any[] = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages: any[] = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, [db]);

  return (
    <>
      {currentUser.role !== "Cashier" ? (
        <Card className="my-5 ml-3 border border-orange-400">
          <CardHeader className="border-b mb-3 border-b-orange-400">
            <CardTitle>Bukka hut chat room</CardTitle>
            <CardDescription>Send messages to team members.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] overflow-y-scroll">
            {messages.map((message: any) => (
              <div
                className={`flex ${
                  message.email === currentUser.email
                    ? "justify-end text-right"
                    : "justify-start  text-left"
                } items-start grow`}
                key={message.id}
              >
                <Avatar className="mr-2">
                  <AvatarFallback>BH</AvatarFallback>
                </Avatar>
                <p
                  className={`shadow-sm ${
                    message.email === currentUser.email
                      ? "bg-orange-200 text-right"
                      : "bg-gray-300 text-left"
                  }  my-2 rounded-md p-2 text-[13px]`}
                >
                  <span className="block text-[10px] font-semibold">
                    {message.name}
                  </span>
                  {message.text}
                </p>
              </div>
            ))}

            {/* <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form> */}
          </CardContent>
          <span ref={scroll}></span>
          <CardFooter ref={scroll}>
            <form
              onSubmit={handleSubmit}
              className="flex justify-between items-center"
            >
              <Input
                onChange={handleChange}
                value={message}
                id="name"
                className="py-3"
                placeholder="Message"
              />
              <Button type="submit" className=" ml-2">
                send
              </Button>
            </form>
          </CardFooter>
          <Toaster />
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default ChatRoom;
