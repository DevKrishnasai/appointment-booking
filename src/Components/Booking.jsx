import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { useContext, useEffect, useState } from "react";
import { YearAndMonth, uploadToFirebase } from "../services/helpers";
import { twMerge } from "tailwind-merge";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { context } from "../services/ContextProvider";

const Booking = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [err, setErr] = useState("");
  const [map, setMap] = useState({});
  const [done, setDone] = useState(false);

  const { loading, setLoading, selectedDates, setSelectedDates } =
    useContext(context);

  const handleBooking = (data) => {
    setErr("");
    if (!date) {
      setErr({
        message: "Please pick a date",
        date: true,
      });
      return;
    } else if (!time) {
      setErr({
        message: "Please select a time slot",
        time: true,
      });
      return;
    }

    // Send formatted date and time along with other data
    const finalData = { ...data, time, date };
    uploadToFirebase(finalData, setErr, setLoading, map, setDone);
  };

  useEffect(() => {
    const firebaseInitialFetch = async () => {
      try {
        setLoading(true);
        const bookingsCollection = collection(db, "bookings");
        const data = await getDocs(bookingsCollection);

        const filteredData = data.docs.map((d) => ({ ...d.data(), id: d.id }));
        const filtered = filteredData.find((d) => d.id === YearAndMonth);

        const dateArray = Object.keys(filtered.slots);
        setMap(filtered.slots);
        setSelectedDates(dateArray);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    firebaseInitialFetch();
  }, [setLoading, setSelectedDates]);

  return (
    <div
      className={twMerge(
        "min-h-[calc(100vh-50px)] ",
        loading && "flex flex-col justify-center items-center",
        done && "flex flex-col justify-center items-center"
      )}
    >
      {loading ? (
        <span className="loading loading-infinity loading-lg text-black"></span>
      ) : done ? (
        <div className="text-black text-2xl font-bold">
          Booked slot on{" "}
          {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          at {time} 🥳
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-lg text-center mt-10">
            <h1 className="text-2xl font-bold sm:text-3xl text-black">
              Get started today!
            </h1>

            <p className="mt-4 text-black">
              Fill the basic details to proceed with your appointment
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleBooking)}
            className="mx-auto mb-0 mt-8 max-w-md space-y-4 flex flex-col justify-center "
          >
            <div className="relative text-center">
              <input
                type="text"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black text-black"
                placeholder="Enter name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-center text-sm">
                  {errors.name?.message}
                </span>
              )}
            </div>

            {/* <div className="relative">
          <PhoneInput
            onChange={setPhoneNumber}
            value={phoneNumber}
            defaultCountry="IN"
            international
            countryCallingCodeEditable={false}
            className="input input-primary w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent  border-2 border-black placeholder:text-black"
            placeholder="Enter phone number"

          />
        </div> */}

            <div className="relative text-center">
              <input
                type="text"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black text-black"
                placeholder="Enter state"
                {...register("state", {
                  required: "State is required",
                })}
              />
              {errors.state && (
                <span className="text-red-500 text-center text-sm">
                  {errors.state?.message}
                </span>
              )}
            </div>

            <div className="relative text-center">
              <input
                type="text"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black text-black"
                placeholder="Enter city"
                {...register("city", {
                  required: "City is required",
                })}
              />
              {errors.city && (
                <span className="text-red-500 text-center text-sm">
                  {errors.city?.message}
                </span>
              )}
            </div>

            <div className="relative text-center">
              <input
                type="number"
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black text-black"
                placeholder="Enter pincode"
                {...register("pincode", {
                  maxLength: 6,
                  pattern: /^[0-9]{6}$/,
                  minLength: {
                    message: "Please enter 6 digit pincode",
                    value: 6,
                  },
                  required: "Pincode is required",
                })}
              />
              {errors.pincode && (
                <span className="text-red-500 text-center text-sm">
                  {errors.pincode?.message}
                </span>
              )}
            </div>

            <div className="relative text-center w-full">
              <select
                className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black text-black"
                placeholder="Enter city"
                onChange={(event) => {
                  setErr("");
                  setDate(event.target.value);
                }}
                value={date}
              >
                <option disabled selected value={null}>
                  Pick a date
                </option>
                {selectedDates.map((date) => {
                  return (
                    map[date]?.availableTimes?.length > 0 && (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </option>
                    )
                  );
                })}
              </select>
              {err.date && (
                <span className="text-red-500 text-center text-sm">
                  {err.message}
                </span>
              )}
            </div>

            {date && (
              <div className="flex justify-center items-center">
                {map[date]?.availableTimes?.length > 0 &&
                  map[date]?.availableTimes.map((t) => {
                    return (
                      <span
                        key={t}
                        className={twMerge(
                          "badge bg-white shadow-md text-black font-bold cursor-pointer",
                          time === t && "bg-black text-white"
                        )}
                        onClick={() => {
                          setErr("");
                          setTime(t);
                        }}
                      >
                        {t}
                      </span>
                    );
                  })}
              </div>
            )}
            {err.time && (
              <p className="text-black text-center text-sm">select a time</p>
            )}
            {err.form && (
              <span className="text-black text-center text-sm">
                {err.form?.message}
              </span>
            )}

            <button className="btn  btn-primary bg-black text-white">
              Book
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default Booking;
