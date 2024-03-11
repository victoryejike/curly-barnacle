/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { LucideTrash2 } from "lucide-react";
import { state } from "@/state";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const CountdownTimer = ({
  waitTime,
  identifier,
  onCountdownFinish,
  data,
  setData,
}: any) => {
  const db = getFirestore();
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);
  const localStorageKey = `countdownTimer_${identifier}`;
  const [countdownFinished, setCountdownFinished] = useState(false);
  const isMounted = useRef(true);
  //   const snap = useSnapshot(state);

  const handleTimeConversion = (time: any) => {
    const futureTimestamp: any = time;
    const currentTimestamp: any = new Date().getTime();
    const remainingDbTime: number = futureTimestamp - currentTimestamp;

    if (!isNaN(remainingDbTime) && remainingDbTime >= 0) {
      const remainingTimeInMinutes = Math.floor(remainingDbTime / 1000);
      return remainingTimeInMinutes;
    } else {
      return 0;
    }
  };

  const [remainingTime, setRemainingTime] = useState<any>(
    handleTimeConversion(waitTime),
  );
  useEffect(() => {
    let timer: any;
    const clearTimer = () => clearInterval(timer);

    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime: any) => {
          const newTime = prevTime - 1;
          return newTime;
        });
      }, 1000);
    } else if (!countdownFinished) {
      setCountdownFinished(true);
      // onCountdownFinish(); // Call the callback function when countdown finishes
      localStorage.removeItem(localStorageKey);
      state.showDelete = true;
    }

    return () => {
      if (timer) {
        clearTimer();
      }
    };
  }, [
    onCountdownFinish,
    localStorageKey,
    countdownFinished,
    data,
    remainingTime,
  ]);

  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    // const newWaitTIme = handleTimeConversion(waitTime) * 60;
    // setRemainingTime(newWaitTIme);
    return () => {
      isMounted.current = false;
    };
  }, [
    onCountdownFinish,
    localStorageKey,
    countdownFinished,
    data,
    remainingTime,
    waitTime,
  ]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const handleDelete = async (id: string) => {
    const updatedOrders: any = data.map((order: any) => {
      if (order.id === id) {
        return {
          ...order,
          isExpired: true,
        };
      }
      return order; // Return the unchanged order for other items
    });

    await setDoc(doc(db, "orders", currentUser.location), {
      updatedOrders,
    });

    const docRef = doc(db, "orders", currentUser.location);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.updatedOrders)) {
        setData(data.updatedOrders);
      }
    }
  };

  return (
    <div>
      {countdownFinished ? (
        <div className="flex justify-start items-center">
          <p>Ready Now!</p>
          {currentUser.role === "Cashier" ||
          currentUser.role === "Order processor" ||
          currentUser.role === "Audit Assistant" ? (
            <LucideTrash2
              className="text-red-400 cursor-pointer ml-10"
              onClick={() => handleDelete(identifier)}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <p>Remaining Time {formatTime(remainingTime)}</p>
      )}
    </div>
  );
};

export default CountdownTimer;
