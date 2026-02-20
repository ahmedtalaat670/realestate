import { useContext, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

// Layout component
export function Layout() {
  const navigationType = useNavigationType();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !currentUser.verified) navigate("/verification");
  }, [currentUser, location.pathname, navigate]);
  useEffect(() => {
    if (navigationType === "PUSH") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigationType]);
  return (
    <div className="">
      <div className="w-full fixed top-0 z-10">
        <Navbar />
      </div>
      <div className="flex-1 h-[calc(100vh-100px)] mt-[100px]">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

// RequireAuth wrapper using same layout
export function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (
      currentUser &&
      (location.pathname.includes("login") ||
        location.pathname.includes("register"))
    )
      navigate("/");
    else if (
      !currentUser &&
      !(
        location.pathname.includes("login") ||
        location.pathname.includes("register")
      )
    )
      navigate("/login");
    else if (
      currentUser &&
      !currentUser.verified &&
      !location.pathname.includes("profile")
    )
      navigate("/verification");
    else if (
      currentUser &&
      currentUser.verified &&
      location.pathname.includes("verification")
    )
      navigate("/");
  });
  useEffect(() => {
    if (navigationType === "PUSH") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigationType]);
  return (
    <div className="">
      <div className="w-full fixed top-0 z-10">
        <Navbar />
      </div>
      <div className="flex-1 h-[calc(100vh-100px)] mt-[100px]">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
