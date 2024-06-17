import React, { useState } from "react";

export default function Timer() {
  const [timer, setTimer] = useState("yyyy-mm-dd 00:00:00");

  const currentTimer = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    setTimer(`${year}년 ${month}월 ${day}일 ${hours}:${minutes}`);
  };

  const startTimer = () => {
    setInterval(currentTimer, 1000);
  };

  startTimer();

  return (
    <div className="w-11/12 p-4">
      <p className="text-lg text-gray-500">{timer}</p>
    </div>
  );
}
