// react router
import { Outlet } from "react-router";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";

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
