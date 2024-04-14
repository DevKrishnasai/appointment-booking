import React, { useContext, useState } from "react";
import { context } from "../services/ContextProvider";
import { handleLogin, verifyOtp } from "../services/helpers";
import PhoneInput from "react-phone-number-input";
import OTPInput from "otp-input-react";
import "react-phone-number-input/style.css";
const LoginPage = () => {
  const { phone, setPhone, err, setErr, loading, setLoading, user, setUser } =
    useContext(context);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(null);
  return (
    <div className="relative h-screen w-screen">
      <div
        id="landing-page-bg"
        className="h-screen w-screen bg-white flex justify-center items-center"
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col ${
          otpSent ? "gap-4" : "gap-2"
        }`}
      >
        {otpSent ? (
          <>
            <h1 className="text-center font-bold text-2xl text-white mb-4">
              Enter OTP
            </h1>
            <OTPInput
              value={otp}
              onChange={setOtp}
              autoFocus
              OTPLength={6}
              otpType="number"
            />
            {err && <p className="text-error text-center">{err.errMsg} </p>}
            <button
              className="btn  btn-primary text-white"
              onClick={() => verifyOtp(otp, user, setUser, setErr, setLoading)}
            >
              {loading ? (
                <span className="loading loading-infinity loading-md"></span>
              ) : (
                "Verify"
              )}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-center font-bold text-2xl text-white mb-5">
              Login/Register
            </h1>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="IN"
              value={phone}
              onChange={setPhone}
              className="input input-primary"
            />
            {err && <p className="text-error text-center">{err.errMsg} </p>}
            {!otpSent && <div id="recaptcha"></div>}

            <button
              className={`btn ${loading ? "" : "btn-primary"} px-5 text-white`}
              onClick={() => {
                if (!loading) {
                  handleLogin(phone, setUser, setErr, setOtpSent, setLoading);
                }
              }}
            >
              {loading ? (
                <span className="loading loading-infinity loading-md"></span>
              ) : (
                "Login"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

/* <label className="input input-primary bg-transparent flex items-center gap-2 ">
          <svg
            className="w-4 h-4 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 19 18"
          >
            <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
          </svg>
          <input
            type="number"
            className="text-white placeholder:text-white"
            placeholder="phone number"
            onChange={(e) => handleInputChange(e, err, setErr, setPhone)}
            value={phone}
          />
        </label> */
