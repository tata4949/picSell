import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash       from "./pages/Splash";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Home         from "./pages/Home";
import Camera       from "./pages/Camera";
import Confirm      from "./pages/Confirm";
import Assessing    from "./pages/Assessing";
import Questions    from "./pages/Questions";
import Result       from "./pages/Result";
import Proposal     from "./pages/Proposal";
import Listing      from "./pages/Listing";
import HistoryDetail from "./pages/HistoryDetail";
import Plan         from "./pages/Plan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Splash />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/home"          element={<Home />} />
        <Route path="/camera"        element={<Camera />} />
        <Route path="/confirm"       element={<Confirm />} />
        <Route path="/assessing"     element={<Assessing />} />
        <Route path="/questions"     element={<Questions />} />
        <Route path="/result"        element={<Result />} />
        <Route path="/proposal"      element={<Proposal />} />
        <Route path="/listing"       element={<Listing />} />
        <Route path="/history-detail" element={<HistoryDetail />} />
        <Route path="/plan"          element={<Plan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;