import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import AvailableAppointments from "../Components/AvailableAppointments";
import SlotsUpdation from "../Components/SlotsUpdation";

const AdminPage = () => {
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
            select === "update" && "bg-white text-black rounded-full"
          )}
          onClick={() => {
            setSelect("update");
          }}
        >
          Slots Updation
        </p>
      </nav>

      {select === "Appointments" && <AvailableAppointments />}
      {select === "update" && <SlotsUpdation />}
    </div>
  );
};

export default AdminPage;
