import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash    from "./pages/Splash";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Home      from "./pages/Home";
import Camera    from "./pages/Camera";
import Confirm   from "./pages/Confirm";
import Assessing from "./pages/Assessing";
import Result    from "./pages/Result";
import Proposal  from "./pages/Proposal";
import Listing   from "./pages/Listing";
import History   from "./pages/History";
import Plan      from "./pages/Plan";
import Setting   from "./pages/Setting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Splash />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/home"      element={<Home />} />
        <Route path="/camera"    element={<Camera />} />
        <Route path="/confirm"   element={<Confirm />} />
        <Route path="/assessing" element={<Assessing />} />
        <Route path="/result"    element={<Result />} />
        <Route path="/proposal"  element={<Proposal />} />
        <Route path="/listing"   element={<Listing />} />
        <Route path="/history"   element={<History />} />
        <Route path="/plan"      element={<Plan />} />
        <Route path="/setting"   element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
