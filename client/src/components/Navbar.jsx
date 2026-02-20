import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { text: "home", to: "/" },
  { text: "about", to: "/about" },
  { text: "contact us", to: "/contact-us" },
  { text: "posts", to: "/list?page=1" },
];

export default function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const { notificationsNumber } = useContext(UserContext);
  const dropdownLinks = () => {
    if (currentUser) {
      return [...navLinks, { text: "profile", to: "/profile" }];
    } else {
      return [
        ...navLinks,
        { text: "sign in", to: "/login" },
        { text: "sign up", to: "/register" },
      ];
    }
  };
  return (
    <nav className="w-full h-[100px] flex justify-between items-center bg-white">
      {/* LEFT */}
      <div className="flex items-center gap-10 flex-3 ml-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 hover:scale-110 transition-all duration-200"
        >
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          {/* Show on md+, hide on sm */}
          <span className="block md:hidden lg:block font-bold text-xl">
            RealEstate
          </span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <NavLink
              to={link.to}
              key={i}
              className={({ isActive }) =>
                `capitalize hover:scale-x-110 transition-all duration-200 py-4 ${
                  isActive && "border-b-(--primary-color) border-b-4"
                }`
              }
            >
              {link.text}
            </NavLink>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 flex-2 justify-end pr-2 h-full lg:bg-(--primary-bg-color)">
        {/* Desktop Auth */}
        {currentUser ? (
          <div className="hidden md:flex items-center gap-8 pr-2">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="">{currentUser.name}</span>
            </div>

            <Link
              to="/profile"
              className="px-4 py-2 bg-(--primary-color) hover:bg-(--primary-color-hover) relative"
            >
              {notificationsNumber > 0 && (
                <div className="absolute -right-2 -top-2 px-2 rounded-full bg-red-600 text-white">
                  {notificationsNumber}
                </div>
              )}
              Profile
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-5">
            <Link to="/login" className="">
              Sign in
            </Link>
            <Link to="/register" className="py-2 px-5 bg-(--primary-color)">
              Sign up
            </Link>
          </div>
        )}

        {/* MOBILE MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger className={"md:hidden w-8 h-8"}>
            <img src="/menu.png" alt="menu" className="" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className={"w-screen"}>
            <DropdownMenuLabel className={"text-2xl"}>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dropdownLinks().map((link, i) => (
              <DropdownMenuItem>
                <NavLink
                  to={link.to}
                  key={i}
                  className={({ isActive }) =>
                    `font-medium text-xl w-full py-8 px-5 capitalize block rounded-lg ${
                      isActive &&
                      `border-r-(--primary-color) border-r-4 bg-[#edede9]`
                    }`
                  }
                >
                  {link.text}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
