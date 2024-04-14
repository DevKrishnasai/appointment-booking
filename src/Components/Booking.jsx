import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { uploadToFirebase } from "../services/helpers";

const Booking = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [err, setErr] = useState("");
  const filterDates = (date) => {
    const currentDate = new Date();
    const isToday =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
    const isInCurrentMonth =
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
    return isInCurrentMonth && !isToday;
  };
  const handleBooking = (data) => {
    if (!date || !time) {
      setErr("Please select both date and time");
      return;
    }

    // Format date and time
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Send formatted date and time along with other data
    const finalData = { ...data, date: formattedDate, time: formattedTime };
    uploadToFirebase(finalData, setErr);
  };
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 h-full ">
      <div className="mx-auto max-w-lg text-center">
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

        <div className="flex gap-2">
          {/* <div className="relative flex-1 text-center">
            <input
              type="date"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2  placeholder:text-black  text-black"
              placeholder="select a date"
              {...register("date", {
                required: "Date is required",
              })}
            />
            {errors.date && (
              <span className="text-red-500 text-center text-sm">
                {errors.date?.message}
              </span>
            )}
          </div> */}
          <div className="relative flex-1 text-center">
            <DatePicker
              required
              selected={date}
              onChange={(date) => {
                setDate(date);
                setErr("");
              }}
              minDate={new Date(Date.now())}
              filterDate={filterDates}
              dateFormat="dd/MM/yyyy"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2  placeholder:text-black  text-black"
            />
            {err?.date && (
              <span className="text-red-500 text-center text-sm">
                select a date
              </span>
            )}
          </div>
          {/* <div className="relative flex-1 text-center">
            <input
              type="time"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black selection:text-black  text-black"
              placeholder="select a time slot"
              {...register("time", {
                required: "Time slot is required",
              })}
            />
            {errors.time && (
              <span className="text-red-500 text-center text-sm">
                {errors.time?.message}
              </span>
            )}
          </div> */}
          <div className="relative flex-1 text-center">
            <DatePicker
              required
              selected={time}
              onChange={(date) => {
                setTime(date);
                setErr("");
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="slot"
              dateFormat="h:mm aa"
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-transparent border-black border-2 placeholder:text-black selection:text-black  text-black"
            />
            {err?.time && (
              <span className="text-red-500 text-center text-sm">
                select a time slot
              </span>
            )}
          </div>
        </div>
        {err?.form && (
          <span className="text-red-500 text-center text-sm">
            {err.form?.message}
          </span>
        )}

        <button
          className="btn  btn-primary bg-black text-white"
          onClick={() => {
            if (!date) {
              setErr({
                date: true,
              });
            } else if (!time) {
              setErr({
                time: true,
              });
            }
          }}
        >
          Book
        </button>
      </form>
    </div>
  );
};
export default Booking;
