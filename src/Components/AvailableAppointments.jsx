import React, { useContext, useEffect, useState } from "react";
import { context } from "../services/ContextProvider";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { YearAndMonth } from "../services/helpers";
import { twMerge } from "tailwind-merge";
import AdminCard from "./AdminCard";

const AvailableAppointments = () => {
  const { loading, setLoading } = useContext(context);
  const [appointments, setAppointments] = useState([]);
  const [today, setToday] = useState(false);
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        const ref = collection(db, "bookings");
        const data = await getDocs(ref);
        const filteredData = data.docs.map((d) => ({ ...d.data(), id: d.id }));
        const filteredUser = filteredData.find((d) => d.id === YearAndMonth);
        console.log(filteredUser);

        if (filteredUser) {
          const appointmentsData = [];

          for (const date in filteredUser.slots) {
            const bookedTimeArray = filteredUser.slots[date].bookedTimes;

            for (const bookedTime of bookedTimeArray) {
              const subCollectionName = `${date}--${bookedTime}`;
              const bookingDocRef = doc(db, "bookings", YearAndMonth);
              const subCollectionRef = collection(
                bookingDocRef,
                subCollectionName
              );
              const data1 = await getDocs(subCollectionRef);
              const filteredData = data1.docs.map((d) => ({
                ...d.data(),
                id: d.id,
              }));
              appointmentsData.push(filteredData[0]);
            }
          }

          setAppointments(appointmentsData);

          for (let app of appointmentsData) {
            const today = new Date().toLocaleDateString("en-US");
            const date = new Date(app.date).toLocaleDateString("en-US");
            if (today === date) {
              setToday(true);
              break;
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, []); // Empty dependency array to run once on mount

  return (
    <div
      className={twMerge(
        "h-full min-h-screen w-full px-2 ",
        loading && "flex justify-center items-center"
      )}
    >
      {loading ? (
        <span className="loading loading-infinity loading-lg text-black"></span>
      ) : (
        <>
          <div className="mx-auto max-w-fit text-center mt-5 lg:mt-12 mb-7">
            <h1 className="text-2xl font-bold sm:text-3xl text-black">
              Hello Master👋 here are your appointments for today
            </h1>
          </div>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <h1 className="text-xl font-bold lg:text-2xl text-black text-center">
                You have no appointments for today
              </h1>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 mt-3 mb-5">
                {!today && (
                  <div className="text-xl font-bold lg:text-2xl text-black text-center">
                    You have no appointments for today
                  </div>
                )}
                {appointments.map((appointment, index) => {
                  const today = new Date().toLocaleDateString("en-US");
                  const date = new Date(appointment.date).toLocaleDateString(
                    "en-US"
                  );

                  return today === date ? (
                    <AdminCard
                      key={index}
                      date={new Date(appointment.date).toLocaleDateString(
                        "en-US"
                      )}
                      time={appointment.time}
                      name={appointment.name}
                      phoneNumber={appointment.phoneNumber}
                      city={appointment.city}
                      state={appointment.state}
                      pincode={appointment.pincode}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="space-y-4 mt-10">
            <h1 className="text-xl font-bold lg:text-2xl text-black text-center">
              Future Appointments
            </h1>
            {appointments.length === 0 ? (
              <h1 className="text-xl font-bold lg:text-2xl text-black text-center">
                You have no appointments for today
              </h1>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 mt-3 mb-5">
                {appointments.map((appointment, index) => {
                  const today = new Date().toLocaleDateString("en-US");
                  const date = new Date(appointment.date).toLocaleDateString(
                    "en-US"
                  );

                  return today !== date ? (
                    <AdminCard
                      key={index}
                      date={new Date(appointment.date).toLocaleDateString(
                        "en-US"
                      )}
                      time={appointment.time}
                      name={appointment.name}
                      phoneNumber={appointment.phoneNumber}
                      city={appointment.city}
                      state={appointment.state}
                      pincode={appointment.pincode}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AvailableAppointments;
