// react router
import { Outlet, useNavigate } from "react-router";

// components
// import Header from "./components/Header";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect } from "react";

const RootLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/upcoming-matches");
  }, []);
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
