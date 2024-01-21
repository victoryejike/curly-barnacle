/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";

const CountdownTimer = ({ waitTime, identifier, onCountdownFinish }: any) => {
  const localStorageKey = `countdownTimer_${identifier}`;
  const [remainingTime, setRemainingTime] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)!) || waitTime * 60
  );
  const [countdownFinished, setCountdownFinished] = useState(false);
  const isMounted = useRef(true);

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
    }

    return () => {
      if (timer) {
        clearTimer();
      }
    };
  }, [remainingTime, onCountdownFinish, localStorageKey, countdownFinished]);

  // Set the isMounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div>
      {countdownFinished ? (
        <p>Countdown finished!</p>
      ) : (
        <p>Remaining Time {formatTime(remainingTime)}</p>
      )}
    </div>
  );
};

export default CountdownTimer;
