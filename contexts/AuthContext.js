import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { checkFridgeSync } from "../services/fridgeSync";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const response = await authService.getUser();

    if (response?.error) {
      setUser(null);
    } else {
      setUser(response);
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    if (response?.error) {
      return response;
    }

    await checkUser();

    const fridgeSync = await checkFridgeSync();
    return { success: true, fridgeSync };
  };

  const register = async (email, password, username) => {
    const response = await authService.register(email, password, username);

    if (response?.error) {
      return response;
    }

    return login(email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    await checkUser();
  };

  return (
    <authContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
