import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#f3f3fc]">
      <Navbar />
      <div className="flex w-full">
        {/* <Sidebar /> */}
        <main className="flex-1 p-6 md:p-10 lg:p-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
