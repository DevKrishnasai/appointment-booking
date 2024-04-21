import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "./firebase";
import Cookies from "js-cookie";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export const YearAndMonth =
  new Date(Date.now()).getFullYear().toString() +
  (new Date(Date.now()).getMonth() + 1).toString();

export const handleInputChange = (e, err, setErr, setPhone) => {
  const numericValue = e.target.value;
  if (numericValue.length > 10) {
    setErr({
      errMsg: "Phone number must be 10 digits",
    });
  } else {
    setErr({
      errMsg: "",
    });
    setPhone(numericValue);
  }
};

// export const checkKeyPressed = (e, setErr) => {
//   // if (e.key in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
//   //   setErr({ errMsg: "" });
//   // } else {
//   //   setErr({ errMsg: "Plz enter a valid mobile number" });
//   // }
// };

export const handleLogin = (phone, setUser, setErr, setOtpSent, setLoding) => {
  if (phone.length !== 13) {
    setErr({ errMsg: "Plz enter a valid mobile number" });
  } else {
    setErr({ errMsg: "" });
    // firabase todo: check
    firebaseVerification(phone, setUser, setErr, setOtpSent, setLoding);
  }
};

const firebaseVerification = async (
  phone,
  setUser,
  setErr,
  setOtpSent,
  setLoding
) => {
  setLoding(true);
  try {
    console.log(phone);
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
    const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
    console.log(confirmation);
    if (confirmation) {
      setOtpSent(true);
      setUser(confirmation);
    } else {
      setOtpSent(false);
      setErr({ errMsg: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    setErr({ errMsg: error.message });
  } finally {
    setLoding(false);
  }
};

export const verifyOtp = async (otp, user, setUser, setErr, setLoding) => {
  setLoding(true);
  try {
    if (otp.length < 6) {
      setErr({ errMsg: "OTP must be 6 digits" });
      return;
    }
    setErr({ errMsg: "" });
    const firebaseUser = await user.confirm(otp);
    // todo save user details
    console.log(firebaseUser.user.uid);
    setUser({
      uid: firebaseUser.user.uid,
      phoneNumber: firebaseUser.user.phoneNumber,
    });
    Cookies.set("userToken", firebaseUser.user.uid, { expires: 7 });
  } catch (error) {
    console.log(error);
    if (error.message.includes("invalid")) {
      setErr({ errMsg: "Invalid OTP" });
    } else {
      setErr({ errMsg: error.message });
    }
  } finally {
    setLoding(false);
  }
};

export const uploadToFirebase = async (
  data,
  setErr,
  setLoading,
  map,
  setDone
) => {
  // firabase todo: check
  try {
    setErr({
      errMsg: "",
    });
    setLoading(true);
    console.log("Uploading booking");

    //checking if the booking has already been done
    const bookingDocRef = doc(db, "bookings", YearAndMonth);
    const subCollectionName = data.date + "--" + data.time;
    const subCollectionRef = collection(bookingDocRef, subCollectionName);
    const data1 = await getDocs(subCollectionRef);
    const filteredData = data1.docs.map((d) => ({ ...d.data(), id: d.id }));
    const filtered = filteredData.find(
      (d) => d.id === auth.currentUser.phoneNumber
    );
    if (filtered) {
      if (filtered.id === auth.currentUser.phoneNumber) {
        setErr({
          errMsg: "You have already booked this slot",
        });
        return;
      } else {
        setErr({
          errMsg: "someone have booked this slot",
        });
        return;
      }
    }

    // Add doc for admin (nested adding (subcollection))
    const userDocRef = doc(subCollectionRef, auth.currentUser.phoneNumber);
    await setDoc(userDocRef, {
      ...data,
      phoneNumber: auth.currentUser.phoneNumber,
    });

    //updating in bookings array for that date
    const availableTimes = map[data.date].availableTimes;
    const bookedTimes = map[data.date].bookedTimes;
    const timeToRemove = data.time;
    const indexOfTimeToRemove = availableTimes.indexOf(timeToRemove);
    if (indexOfTimeToRemove !== -1) {
      availableTimes.splice(indexOfTimeToRemove, 1);
      bookedTimes.push(timeToRemove);

      //in bookings/YearAndDate/{}
      await setDoc(bookingDocRef, {
        slots: {
          ...map,
          [data.date]: { availableTimes, bookedTimes },
        },
      });
      //in bookings/YearAndDate/Date+Time/Ph number/{}
      await setDoc(userDocRef, {
        ...data,
        phoneNumber: auth.currentUser.phoneNumber,
      });
    } else {
      console.log("Time not found in availableTimes.");
    }

    //Add doc for user/ph no/{}
    const userBookingDocRef = doc(db, "users", auth.currentUser.phoneNumber);
    const { name, state, city, pincode } = data;
    await setDoc(
      userBookingDocRef,
      {
        name,
        state,
        city,
        pincode,
        phoneNumber: auth.currentUser.phoneNumber,
        bookings: arrayUnion(`${data.date}--${data.time}`),
      },
      { merge: true }
    );

    console.log("Booking saved");
    setDone(true);
  } catch (error) {
    setErr(error.message);
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const filterDates = (date) => {
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
