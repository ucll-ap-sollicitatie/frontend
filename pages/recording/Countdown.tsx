import { NextPage } from "next";
import { useState, useRef, useEffect } from "react";

interface Props {
  handleStopCaptureClick: () => void;
}

const CountDown: NextPage<Props> = ({ handleStopCaptureClick }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          handleStopCaptureClick();
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <span>
      {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </span>
  );
};

export default CountDown;
