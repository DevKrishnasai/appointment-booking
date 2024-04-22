import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../services/firebase";
import { YearAndMonth, filterDates } from "../services/helpers";
import { context } from "../services/ContextProvider";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

const SlotsUpdation = () => {
  const { loading, setLoading } = useContext(context);
  const [dates, setDates] = useState([]); //for storing dates
  const [map, setMap] = useState({}); //for storing dates with time slots
  const [timeSlots, setTimeSlots] = useState([
    "9:00 AM",
    "9:15 AM",
    "9:30 AM",
    "9:45 AM",
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "2:00 PM",
    "2:15 PM",
    "2:30 PM",
    "2:45 PM",
    "3:00 PM",
    "3:15 PM",
    "3:30 PM",
    "3:45 PM",
    "4:00 PM",
    "4:15 PM",
    "4:30 PM",
  ]);

  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(db, `bookings`);
        const rawData = await getDocs(collectionRef); // bookings/{All YearsAndMonths}/{all docs}
        const data = rawData.docs.map((d) => ({ ...d.data(), id: d.id }));
        const filtered = data.find((d) => d.id === YearAndMonth); //  {id: 20244 , slots:{"24-04-2024":["10:00 AM","11:00 PM","12:00 PM"],"26-04-2024":["12:00 PM"]}}
        if (filtered) {
          const datesMap = filtered.slots;
          setMap(datesMap);
          const dateArray = Object.keys(datesMap).map((key) => {
            return new Date(key);
          });

          setDates(dateArray);
        } else {
          setDates([]);
        }
      } catch (error) {
        console.log("from useEffect", error);
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, [setLoading]);

  const notifiy = () =>
    toast.promise(upload(), {
      loading: "Saving...",
      success: <b>Settings saved!</b>,
      error: <b>Could not save.</b>,
    });

  const upload = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, "bookings", YearAndMonth);
      await setDoc(userDocRef, {
        slots: { ...map },
      });
    } catch (error) {
      console.log("from useEffect", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center bg-white">
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <>
          {/* <div>TODO Need to create something to update time</div> */}
          <div className="flex flex-col items-center min-h-screen w-full mt-10 ">
            <h1 className="text-xl font-bold sm:text-xl text-black mb-6">
              select/remove appointment dates
            </h1>

            <ReactDatePicker
              selectedDates={dates}
              selectsMultiple
              onChange={(rawdates) => {
                if (rawdates.length === dates.length) {
                  return rawdates;
                }
                if (dates.length > rawdates.length) {
                  const dateToRemove = dates.find(
                    (date) => !rawdates.includes(date)
                  );
                  if (dateToRemove) {
                    // Check if there are bookings for the date to be removed
                    if (map[dateToRemove]?.bookedTimes?.length > 0) {
                      console.log(
                        "Cannot remove appointment with active bookings"
                      );
                      toast.error(
                        "Cannot remove appointment with active bookings"
                      );
                      //TODO for future update
                    } else {
                      setDates(rawdates);
                      setMap((prevMap) => {
                        const newMap = { ...prevMap };

                        if (newMap.hasOwnProperty(dateToRemove)) {
                          delete newMap[dateToRemove];
                        }

                        return newMap;
                      });
                    }
                  }
                } else {
                  setDates(rawdates);
                  setMap((m) => ({
                    ...m,
                    [rawdates[rawdates.length - 1]]: {
                      availableTimes: [...timeSlots],
                      bookedTimes: [],
                    },
                  }));
                }
              }}
              minDate={new Date(Date.now())}
              filterDate={filterDates}
              shouldCloseOnSelect={false}
              disabledKeyboardNavigation
              className="input input-primary w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent  border-2 border-black placeholder:text-black mb-10"
            />
            <div className="space-y-4 w-1/2">
              {dates.map((date, index) => {
                const options = {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                const formattedDate = date.toLocaleDateString("en-US", options);
                return (
                  <details
                    key={index}
                    className="group [&_summary::-webkit-details-marker]:hidden"
                    open
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900">
                      <h2 className="font-medium">{formattedDate}</h2>
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
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      {timeSlots.map((timeSlot, index) => {
                        return (
                          <div
                            key={index}
                            className={twMerge(
                              `badge bg-white font-bold text-black cursor-pointer`,
                              map[date]?.availableTimes?.includes(timeSlot) &&
                                "bg-black text-white ",
                              map[date]?.bookedTimes?.includes(timeSlot) &&
                                "bg-yellow-300 cursor-not-allowed"
                            )}
                            onClick={() => {
                              const a = map[date];
                              if (a?.availableTimes?.includes(timeSlot)) {
                                const index =
                                  a?.availableTimes?.indexOf(timeSlot);
                                a?.availableTimes.splice(index, 1);
                                setMap({ ...map, [date]: a });
                              } else if (a?.bookedTimes?.includes(timeSlot)) {
                                console.log(
                                  "bookedTime slot cannot be deselected"
                                );
                                toast.error(
                                  "booked timeslot cannot be deselected"
                                );
                              } else {
                                a?.availableTimes?.push(timeSlot);
                                setMap({ ...map, [date]: a });
                              }
                            }}
                          >
                            {timeSlot}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
              {dates.length === 0 && (
                <h1 className="text-center">No Dates 😒</h1>
              )}
              <div className="w-full text-center mt-4">
                <button onClick={notifiy} className="btn bg-black text-white">
                  update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SlotsUpdation;
