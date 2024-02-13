/* eslint-disable @typescript-eslint/no-explicit-any */
import Backoffice from "./pages/Backoffice";
import Frontoffice from "./pages/Frontoffice";
import Header from "./components/Header";
import { Toaster, toast } from "react-hot-toast";
import Auth from "./pages/Auth";
import Login from "./pages/Login";

// state
// import { useSnapshot } from "valtio";
// import { state } from "@/state";

// firebase
import { auth } from "@/firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";

// React router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  // const [user] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<any>(true);

  // const snap = useSnapshot(state);
  const local =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user || local) {
        setCurrentUser(true);
      } else {
        setCurrentUser(false);
        <Navigate to="/" />;
        toast.error("Please log in to access this page");
      }
    });
  }, [local]);

  return (
    <section className="">
      <Router>
        <Header />
        <div className="bg-[#FAFAFA]">
          <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px]">
            <Routes>
              <Route path="/signup" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/order"
                element={currentUser ? <Backoffice /> : <Login />}
              />
              <Route
                path="/view"
                element={currentUser ? <Frontoffice /> : <Login />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
      <Toaster />
    </section>
  );
}

export default App;
