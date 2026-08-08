import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import apiRequest from "../lib/apiRequest";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) ?? null,
  );
  const updateUser = useCallback((data) => {
    setCurrentUser(data);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      updateUser,
      setCurrentUser,
    }),
    [currentUser, updateUser],
  );

  const {
    data: authData,
    error,
    isError,
  } = useQuery({
    queryKey: ["authorization"],
    retry: false,
    queryFn: async () => {
      return await apiRequest.get("/auth/authorization");
    },
  });
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    if (isError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
      return;
    }

    if (authData?.data) {
      const user = authData.data;
      setCurrentUser({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        savedPosts: user.savedPosts,
        verified: user.isVerified,
        userId: user._id,
      });
    }
  }, [authData, isError, error]);

  useEffect(() => {
    const handleCookieLost = () => {
      setCurrentUser(null);
      localStorage.removeItem("user");
    };

    window.addEventListener("auth-cookie-lost", handleCookieLost);

    return () => {
      window.removeEventListener("auth-cookie-lost", handleCookieLost);
    };
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
