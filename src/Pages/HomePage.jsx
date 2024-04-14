import React, { useState } from "react";
import Appointments from "../Components/Appointments";
import Booking from "../Components/Booking";
import { twMerge } from "tailwind-merge";

const HomePage = () => {
  const [select, setSelect] = useState("Appointments");
  return (
    <div className="h-full w-full flex flex-col justify-start items-center bg-white">
      <nav className="flex gap-3 bg-black rounded-full mt-2 border-2">
        <p
          className={twMerge(
            "p-3 text-white hover:bg-white hover:text-black cursor-pointer hover:rounded-full font-bold ",
            select === "Appointments" && "bg-white text-black rounded-full"
          )}
          onClick={() => {
            setSelect("Appointments");
          }}
        >
          Appointments
        </p>
        <p
          className={twMerge(
            "p-3 text-white hover:bg-white hover:text-black cursor-pointer hover:rounded-full font-bold ",
            select === "Book" && "bg-white text-black rounded-full"
          )}
          onClick={() => {
            setSelect("Book");
          }}
        >
          Book a slot
        </p>
      </nav>

      {select === "Appointments" && <Appointments />}
      {select === "Book" && <Booking />}
    </div>
  );
};

export default HomePage;
