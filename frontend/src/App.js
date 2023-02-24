import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { DashBoard } from "./pages/dashboard/Dashboard.component";
import HomePage from "./pages/homepage/Homepage.component";
import SignIn from "./pages/signin/SignIn.component";
import Header from "./components/header/header.component";
import { Profile } from "./components/user/profile.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
