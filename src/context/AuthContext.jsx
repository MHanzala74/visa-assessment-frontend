import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("pc_auth");
    return raw ? JSON.parse(raw) : null;
  });
  const [error, setError] = useState(null);

  const signup = useCallback(async (username, password) => {
    setError(null);
    await api.post("/signup", { username, password });
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    // Stash credentials temporarily so the interceptor attaches them
    localStorage.setItem("pc_auth", JSON.stringify({ username, password }));
    try {
      const res = await api.get("/login");
      setAuth({ username, password });
      return res.data;
    } catch (err) {
      localStorage.removeItem("pc_auth");
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pc_auth");
    localStorage.removeItem("pc_phone");
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
