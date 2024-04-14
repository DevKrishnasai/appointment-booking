import React from "react";
import Cards from "./Cards";

const Appointments = () => {
  return (
    <div className="h-full min-h-screen w-full px-2  lg:w-2/3 ">
      <div className="mx-auto max-w-lg text-center mt-14 mb-7">
        <h1 className="text-2xl font-bold sm:text-3xl text-black">
          Hello there 👋
        </h1>
      </div>
      <div className="space-y-4">
        <details
          className="group [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-2 text-black">
            <h2 className="font-medium">Upcoming Appointments</h2>

            <svg
              className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <Cards date={new Date("2024-04-15T04:30:00")} />
            <Cards date={new Date("2024-04-14T12:00:00")} />
            <Cards date={new Date("2024-04-17T21:30:00")} />
            <Cards date={new Date("2024-05-20T01:00:00")} />
          </div>
        </details>
      </div>
    </div>
  );
};

export default Appointments;
