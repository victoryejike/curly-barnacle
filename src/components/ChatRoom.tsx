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
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { customAlphabet } from "nanoid";

const ChatRoom = () => {
  const nanoid = customAlphabet("1234567890abcdef", 15);
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
      return;
    }

    const textMessage = {
      text: message,
      name: currentUser.username,
      createdAt: new Date(),
      email: currentUser.email,
      messageId: `#M-${nanoid(7)}`,
    };
    setMessage("");
    const updatedMessages = [...messages, textMessage];
    setMessages(updatedMessages);

    const docRef = doc(db, "messages", currentUser.location);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(doc(db, "messages", currentUser.location), {
        messages: [...messages, textMessage],
      });
    } else {
      await setDoc(doc(db, "messages", currentUser.location), {
        messages: [...messages, textMessage],
      });
    }

    toast.success("message sent");
  };

  useEffect(() => {
    const docRef = doc(db, "messages", currentUser.location);
    const unsubscribe = onSnapshot(docRef, (doc: any) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUser.location, db]);

  return (
    <>
      {currentUser.role !== "Cashier" ? (
        <Card className="my-5 border border-orange-400">
          <CardHeader className="border-b mb-3 border-b-orange-400">
            <CardTitle>Bukka hut chat room</CardTitle>
            <CardDescription>Send messages to team members.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] overflow-y-scroll">
            {messages.length > 0 &&
              messages.map((message: any) => (
                <div
                  className={`flex ${
                    message.email === currentUser.email
                      ? "justify-end text-right"
                      : "justify-start  text-left"
                  } items-start grow`}
                  key={message.messageId}
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
