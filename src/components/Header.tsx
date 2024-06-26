/* eslint-disable @typescript-eslint/no-explicit-any */
// import Logo from "../assets/bukkahut.svg";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
// import { Link } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

// import ui elements
import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSnapshot } from "valtio";
import { state } from "@/state";

const Header = () => {
  const snap = useSnapshot(state);
  const location = useLocation();
  const { pathname } = location;
  const [currentUser, setCurrentUser] = useState<any>();
  const navigate = useNavigate();
  const loggedInUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const localUser = snap.user;
      if (user && localUser !== null) {
        setCurrentUser(user);
      }
    });
  }, [snap]);

  const handleSignout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      navigate(0);
    });
  };

  return (
    <div className="shadow-md">
      <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px] py-2 flex items-center">
        <div className="flex justify-between items-center grow">
          <div className="flex items-center">
            <img
              src="https://pbs.twimg.com/profile_images/1774674149778001920/twGTpBE3_400x400.png"
              className="w-24 h-24"
              alt="bukkahut logo"
            />
            <p className="font-semibold text-xl leading-8 text-gray-900">
              Bukka Hut
            </p>
          </div>
          <div>
            {currentUser && pathname !== "/login" && pathname !== "/signup" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex bg-orange-500 text-white p-2 rounded-lg">
                    <p className="mr-2">Welcome {currentUser.displayName}</p>
                    <span>
                      <ChevronDown />
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="cursor-pointer font-medium hover:bg-slate-200 hover:rounded">
                    <Link to="/view">View Orders</Link>
                  </DropdownMenuLabel>
                  {(loggedInUser.role === "Cashier" ||
                    loggedInUser.role === "Order processor" ||
                    loggedInUser.role === "Audit Assistant") && (
                    <DropdownMenuLabel className="cursor-pointer font-medium hover:bg-slate-200 hover:rounded">
                      <Link to="/order">Create Order</Link>
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel
                    onClick={handleSignout}
                    className="cursor-pointer text-red-500"
                  >
                    Log out
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
