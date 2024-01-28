import Logo from "../assets/bukkahut.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
// import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

// import ui elements
import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuItem,
  DropdownMenuLabel,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [currentUser] = useAuthState(auth);
  console.log(currentUser);

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
                  Welcome {currentUser.displayName}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel
                    onClick={handleSignout}
                    className="cursor-pointer"
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
