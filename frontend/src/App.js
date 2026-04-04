import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/Navbar";
import { RootRoute, AuthRoute } from "./components/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<RootRoute><div /></RootRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
