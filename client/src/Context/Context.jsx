import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Context.Provider value={{ user, setUser, getProfile, loading }}>
      {children}
    </Context.Provider>
  );
};
