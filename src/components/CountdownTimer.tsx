/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { LucideTrash2 } from "lucide-react";
import { state } from "@/state";
// import { useSnapshot } from "valtio";

const CountdownTimer = ({
  waitTime,
  identifier,
  onCountdownFinish,
  data,
}: any) => {
  const localStorageKey = `countdownTimer_${identifier}`;
  const [remainingTime, setRemainingTime] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)!) || waitTime * 60
  );
  const [countdownFinished, setCountdownFinished] = useState(false);
  const isMounted = useRef(true);
  //   const snap = useSnapshot(state);

  useEffect(() => {
    let timer: any;
    const clearTimer = () => clearInterval(timer);

    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime: any) => {
          const newTime = prevTime - 1;
          localStorage.setItem(localStorageKey, JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);
    } else if (!countdownFinished) {
      setCountdownFinished(true);
      onCountdownFinish(); // Call the callback function when countdown finishes
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
    return () => {
      isMounted.current = false;
    };
  }, [
    onCountdownFinish,
    localStorageKey,
    countdownFinished,
    data,
    remainingTime,
  ]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleDelete = (id: string) => {
    const updatedOrders: any = data.filter((order: any) => order.id !== id);

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.location.reload();
  };

  //   if (countdownFinished && snap.showDelete) {
  //     setTimeout(() => window.location.reload(), 3000);
  //   }

  return (
    <div>
      {countdownFinished ? (
        <div className="flex justify-start items-center">
          <p>Ready Now!</p>
          <LucideTrash2
            className="text-red-400 cursor-pointer ml-10"
            onClick={() => handleDelete(identifier)}
          />
        </div>
      ) : (
        <p>Remaining Time {formatTime(remainingTime)}</p>
      )}
    </div>
  );
};

export default CountdownTimer;
