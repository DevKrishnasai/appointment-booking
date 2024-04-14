import React, { createContext, useState } from "react";

export const context = createContext({
  phone: null,
  setPhone: () => null,
  err: null,
  setErr: () => null,
  loading: false,
  setLoading: () => null,
  user: null,
  setUser: () => null,
});
const ContextProvider = ({ children }) => {
  const [phone, setPhone] = useState(null);
  const [err, setErr] = useState({
    errMsg: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <context.Provider
      value={{
        phone,
        setPhone,
        err,
        setErr,
        setLoading,
        loading,
        user,
        setUser,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ContextProvider;
