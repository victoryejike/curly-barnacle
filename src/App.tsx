/* eslint-disable @typescript-eslint/no-explicit-any */
import Backoffice from "./pages/Backoffice";
import Frontoffice from "./pages/Frontoffice";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Login from "./pages/Login";

import { useAuthState } from "react-firebase-hooks/auth";

// React router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// import auth firebase;
import { auth } from "./firebase";

function App() {
  const [currentUser] = useAuthState(auth);
  console.log(currentUser);
  return (
    <section className="">
      <Header />
      <div className="bg-[#FAFAFA]">
        <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px]">
          <Router>
            <Routes>
              <Route path="/signup" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/order" element={<Backoffice />} />
              <Route path="/view" element={<Frontoffice />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </div>
      </div>
      <Toaster />
    </section>
  );
}

export default App;
