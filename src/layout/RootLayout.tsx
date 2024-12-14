// react router
import { Outlet } from "react-router";

import Footer from "./components/Footer";
import Header from "./components/Header";

const RootLayout = () => {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
