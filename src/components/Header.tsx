import Logo from "../assets/bukkahut.svg";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
// import { Link } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";

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

const Header = () => {
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);
  //   console.log(currentUser);

  const handleSignout = () => {
    signOut(auth).then((result) => {
      console.log(result);
      <Navigate to="/login" />;
    });
  };

  return (
    <div className="shadow-md">
      <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px] py-5 flex items-center">
        <div className="flex justify-between items-center grow">
          <div className="flex items-center">
            <img src={Logo} alt="bukkahut logo" />
            <p className="font-semibold text-xl leading-8 text-gray-900 pl-2">
              Bukka Hut
            </p>
          </div>
          <div>
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex bg-orange-500 text-white p-2 rounded-lg">
                    <p className="mr-2">Welcome {currentUser.username}</p>
                    <span>
                      <ChevronDown />
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="cursor-pointer font-medium">
                    <Link to="/view">View Orders</Link>
                  </DropdownMenuLabel>
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
