import React, { useState, useEffect } from "react";

const CompletedCards = ({ time, date, name }) => {
  const [ended, setEnded] = useState(false);
  const calculateTimeLeft = () => {
    const difference = new Date(date + " " + time) - +new Date();
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
      if (Object.keys(timeLeft).length === 0) {
        setEnded(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  // Format the provided date to display both the date and time
  const dateTimeString = new Date(date + " " + time).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return !ended ? null : (
    <div className="relative service-card w-[290px] md:w-[320px] lg:w-[290px] shadow-xl cursor-pointer snap-start shrink-0 py-8 px-6 bg-white flex flex-col items-center gap-3 transition-all duration-300 group hover:bg-[#202127] text-black hover:text-white">
      <p className="font-bold text-2xl ">{name}</p>
      <p className="text-1xl font-bold">{dateTimeString}</p>
    </div>
  );
};

export default CompletedCards;
