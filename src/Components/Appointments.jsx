import React, { useContext, useEffect, useState } from "react";
import Cards from "./Cards";
import { context } from "../services/ContextProvider";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { YearAndMonth } from "../services/helpers";
import { twMerge } from "tailwind-merge";
import CompletedCards from "./CompletedCards";
import toast from "react-hot-toast";

const Appointments = () => {
  const { loading, setLoading } = useContext(context);
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        const ref = collection(db, "users");
        const data = await getDocs(ref);
        const filteredData = data.docs.map((d) => ({ ...d.data(), id: d.id }));
        const filteredUser = filteredData.find(
          (d) => d.id === auth.currentUser.phoneNumber
        );

        if (filteredUser?.bookings.length > 0) {
          const bookingPromises = filteredUser.bookings.map(async (booking) => {
            const bookingDocRef = doc(db, "bookings", YearAndMonth);
            const subCollectionRef = collection(bookingDocRef, booking);
            const data1 = await getDocs(subCollectionRef);
            const filteredBookingData = data1.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            }));
            const filteredBooking = filteredBookingData.find(
              (d) => d.id === auth.currentUser.phoneNumber
            );
            return filteredBooking;
          });

          const appointments = await Promise.all(bookingPromises);
          console.log(appointments);
          setAppointments([...appointments]);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, [setLoading]);

  const initialFetch = async () => {
    try {
      setLoading(true);
      const ref = collection(db, "users");
      const data = await getDocs(ref);
      const filteredData = data.docs.map((d) => ({ ...d.data(), id: d.id }));
      const filteredUser = filteredData.find(
        (d) => d.id === auth.currentUser.phoneNumber
      );

      if (filteredUser?.bookings.length > 0) {
        const bookingPromises = filteredUser.bookings.map(async (booking) => {
          const bookingDocRef = doc(db, "bookings", YearAndMonth);
          const subCollectionRef = collection(bookingDocRef, booking);
          const data1 = await getDocs(subCollectionRef);
          const filteredBookingData = data1.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          }));
          const filteredBooking = filteredBookingData.find(
            (d) => d.id === auth.currentUser.phoneNumber
          );
          return filteredBooking;
        });

        const appointments = await Promise.all(bookingPromises);
        setAppointments(appointments);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (date, time) => {
    try {
      setLoading(true);
      const ref = collection(db, "users");
      const data = await getDocs(ref);
      const filteredData = data.docs.map((d) => ({ ...d.data(), id: d.id }));
      const filteredUser = filteredData.find(
        (d) => d.id === auth.currentUser.phoneNumber
      );
      console.log(filteredUser);
      if (filteredUser.bookings) {
        const index = filteredUser.bookings.indexOf(date + "--" + time);
        if (index > -1) {
          filteredUser.bookings.splice(index, 1);
        }
        const docref = doc(db, "users", auth.currentUser.phoneNumber);
        await setDoc(docref, { ...filteredUser });

        // const subCollectionName = date + "--" + time;
        // const bookingDocRef = doc(db, "bookings", YearAndMonth);
        // const subCollectionRef = collection(bookingDocRef, subCollectionName);
        // const data1 = await getDocs(subCollectionRef);
        // const filteredData1 = data1.docs.map((d) => ({
        //   ...d.data(),
        //   id: d.id,
        // }));
        // console.log(filteredData1);

        const bookingsRef = collection(db, "bookings");
        const data2 = await getDocs(bookingsRef);
        const filteredData2 = data2.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        const filtered = filteredData2.find((d) => d.id === YearAndMonth);
        if (filtered.slots) {
          const availableTimes = filtered.slots[date].availableTimes;
          const bookedTimes = filtered.slots[date].bookedTimes;
          const index = bookedTimes.indexOf(time);
          if (index > -1) {
            bookedTimes.splice(index, 1);
            availableTimes.push(time);
          }
          const userDocRef = doc(db, "bookings", YearAndMonth);
          await setDoc(userDocRef, {
            slots: { ...filtered.slots },
          });
        }
      }
      setAppointments([]);
      initialFetch();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = (date, time) =>
    toast.promise(cancel(date, time), {
      loading: "Cancelling...",
      success: <b> Cancelled your appointment 🥺!</b>,
      error: <b>Could not Cancel the appointment.</b>,
    });

  return (
    <div
      className={twMerge(
        "h-full min-h-screen w-full px-2  lg:w-2/3 ",
        loading && "flex justify-center items-center"
      )}
    >
      {loading ? (
        <span className="loading loading-infinity loading-lg text-black"></span>
      ) : (
        <>
          <div className="mx-auto max-w-lg text-center mt-5 lg:mt-12 mb-7">
            <h1 className="text-2xl font-bold sm:text-3xl text-black">
              Hello there 👋
            </h1>
          </div>
          <div className="space-y-4">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
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

              {appointments.length === 0 ? (
                <h1 className="text-xl font-bold lg:text-2xl text-black text-center mt-5">
                  You dont't have active appointments
                </h1>
              ) : (
                <div className="flex flex-wrap justify-center gap-3 mt-3 mb-5">
                  {appointments.map((appointment, index) => {
                    return (
                      <Cards
                        key={index}
                        date={new Date(appointment.date).toLocaleDateString(
                          "en-US"
                        )}
                        time={appointment.time}
                        name={appointment.name}
                        cancelAppointment={cancelAppointment}
                        rawDate={appointment.date}
                      />
                    );
                  })}
                </div>
              )}
            </details>
          </div>
          <div className="space-y-4 mt-5">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-2 text-black">
                <h2 className="font-medium">Previous Appointments</h2>

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
              {appointments.length === 0 ? (
                <h1 className="text-xl font-bold lg:text-2xl text-black text-center mt-5">
                  You don't have previous appointments
                </h1>
              ) : (
                <div className="flex flex-wrap justify-center gap-3 mt-3 mb-5">
                  {appointments.map((appointment, index) => {
                    return (
                      <CompletedCards
                        key={index}
                        date={new Date(appointment.date).toLocaleDateString(
                          "en-US"
                        )}
                        time={appointment.time}
                        name={appointment.name}
                      />
                    );
                  })}
                </div>
              )}
            </details>
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;
