import React, { useState, useEffect } from "react";

const Cards = ({ date }) => {
  const calculateTimeLeft = () => {
    const difference = date - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  // Format the provided date to display both the date and time
  const dateTimeString = new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="relative service-card w-[290px] md:w-[320px] lg:w-[290px] shadow-xl cursor-pointer snap-start shrink-0 py-8 px-6 bg-white flex flex-col items-center gap-3 transition-all duration-300 group hover:bg-[#202127] text-black hover:text-white">
      <p className="font-bold text-2xl ">Krishna Sai</p>
      <p className="text-1xl font-bold">{dateTimeString}</p>
      <p className="text-left">Your Appointment starts in</p>
      <div className="flex gap-1">
        <span className="countdown font-mono text-2xl">
          <span style={{ "--value": timeLeft.days }}></span>
        </span>
        days
        <span className="countdown font-mono text-2xl">
          <span style={{ "--value": timeLeft.hours }}></span>
        </span>
        hours
        <span className="countdown font-mono text-2xl">
          <span style={{ "--value": timeLeft.minutes }}></span>
        </span>
        min
        <span className="countdown font-mono text-2xl">
          <span style={{ "--value": timeLeft.seconds }}></span>
        </span>
        sec
      </div>
      <p className=" absolute top-0 right-0 fill-white bg-black  p-2 hover:bg-red-600 hover:fill-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 30 30"
        >
          <path d="M6 8v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8H6zM24 4h-6c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1H6C5.4 4 5 4.4 5 5s.4 1 1 1h18c.6 0 1-.4 1-1S24.6 4 24 4z"></path>
        </svg>
      </p>
    </div>
  );
};

export default Cards;
