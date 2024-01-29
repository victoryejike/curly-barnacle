/* eslint-disable @typescript-eslint/no-explicit-any */
import Backoffice from "./pages/Backoffice";
import Frontoffice from "./pages/Frontoffice";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Login from "./pages/Login";

// React router
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  const currentUser =
    JSON.parse(localStorage.getItem("user")!) !== undefined &&
    JSON.parse(localStorage.getItem("user")!);
  console.log(currentUser);
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
                element={currentUser ? <Backoffice /> : <Navigate to="/" />}
              />
              <Route
                path="/view"
                element={currentUser ? <Frontoffice /> : <Navigate to="/" />}
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
