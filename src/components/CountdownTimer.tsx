/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { LucideTrash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { state } from "@/state";

const CountdownTimer = ({
  waitTime,
  identifier,
  onCountdownFinish,
  data,
}: any) => {
  const localStorageKey = `countdownTimer_${identifier}`;
  const [remainingTime, setRemainingTime] = useState(() => {
    const storedTime = JSON.parse(localStorage.getItem(localStorageKey)!);
    return storedTime !== null ? storedTime : waitTime * 60;
  });
  const [countdownFinished, setCountdownFinished] = useState(
    remainingTime === 0
  );
  // const navigate = useNavigate();
  // const isMounted = useRef(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime: any) => {
        if (prevTime === 0) {
          setCountdownFinished(true);
          onCountdownFinish();
          localStorage.removeItem(localStorageKey);
          clearInterval(timer); // Stop the interval when countdown finishes
          return 0; // Ensure the remaining time is set to 0
        }
        return prevTime - 1; // Continue counting down
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onCountdownFinish, localStorageKey, remainingTime]);

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
    // navigate(0);
  };

  console.log(JSON.parse(localStorage.getItem("orders")!));

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
