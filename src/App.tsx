import Backoffice from "./pages/backoffice";
import Frontoffice from "./pages/frontoffice";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <section className="">
      <Header />
      <div className="bg-[#FAFAFA]">
        <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px]">
          <Router>
            <Routes>
              <Route path="/" element={<Backoffice />} />
              <Route path="/view" element={<Frontoffice />} />
            </Routes>
          </Router>
        </div>
      </div>
    </section>
  );
}

export default App;
