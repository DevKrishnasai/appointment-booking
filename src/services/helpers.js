import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";
import Cookies from "js-cookie";

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

export const uploadToFirebase = (data, setErr) => {
  console.log(data);
  setErr({
    errMsg: "",
  });
  // firabase todo: check
};
