import React, { useContext, useEffect, useState } from "react";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import { context } from "./services/ContextProvider";
import HomePage from "./Pages/HomePage";
import Cookies from "js-cookie";

const Entry = () => {
  const [goTo, setGoTo] = useState("");
  const { user } = useContext(context);
  useEffect(() => {
    setTimeout(() => {
      //here i want to access my cookie
      const userToken = Cookies.get("userToken");
      if (userToken) {
        setGoTo("Home");
      } else {
        if (user?.uid) {
          setGoTo("Home");
        } else {
          setGoTo("Login");
        }
      }
    }, 3000);
  });
  return goTo ? (
    goTo === "Login" ? (
      <LoginPage />
    ) : (
      <HomePage />
    )
  ) : (
    <LandingPage />
  );
};

export default Entry;
