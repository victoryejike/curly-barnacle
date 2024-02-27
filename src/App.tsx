/* eslint-disable @typescript-eslint/no-explicit-any */
import Backoffice from "./pages/Backoffice";
import Frontoffice from "./pages/Frontoffice";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// state
// import { useSnapshot } from "valtio";
import { state } from "@/state";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        state.user = user;
        setIsFetching(false);

        return;
      } else {
        setCurrentUser(null);
        state.user = null;
        setIsFetching(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return (
      <section className="flex justify-center items-center h-screen">
        <div
          className="my-auto h-8 w-8 animate-spin text-orange-300 rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
      </section>
    );
  }

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
                element={
                  <ProtectedRoute user={currentUser}>
                    <Backoffice></Backoffice>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view"
                element={
                  <ProtectedRoute user={currentUser}>
                    <Frontoffice></Frontoffice>
                  </ProtectedRoute>
                }
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
