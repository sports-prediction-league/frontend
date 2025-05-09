// react router
import { Link, Outlet, useNavigate } from "react-router";
import { BiFootball } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

// components
// import Header from "./components/Header";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useAppSelector } from "../state/store";
import { useState } from "react";
import useConnect from "../lib/useConnect";
import toast from "react-hot-toast";
import { History, Loader, Trophy, Wallet } from "lucide-react";
import ScrollToTop from "../common/components/modal/Scroll";

const RootLayout = () => {
  const connected_address = useAppSelector(
    (state) => state.app.connected_address
  );
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false)
  const { handleConnect } = useConnect();
  return (
    <div className="flex flex-col w-full">
      <ScrollToTop />
      <Header />
      <div className="bg-red-500 sticky top-16 z-50  flex items-center md:justify-center gap-10 justify-between text-white py-2 px-5 text-xs">
        <p>Low on test tokens?</p>
        <Link className="underline " target="_blank" to="https://google.com">MINT HERE</Link>
      </div>
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
      <div className="my-20 md:hidden block"></div>
      <div className="w-full p-3 md:hidden  flex items-center sm:justify-around smm:justify-around justify-between shadow-2xl fixed bottom-0 z-50 dark:bg-[#042822] bg-white">
        <button onClick={() => {
          navigate("/")
        }} className={`flex flex-col items-center justify-center ${location.pathname === "/" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}>
          <BiFootball size={25} />
          <p className="text-[9px]">Matches</p>
        </button>
        <button onClick={() => {
          navigate("/leaderboard")
        }} className={`flex flex-col items-center justify-center ${location.pathname === "/leaderboard" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}>
          <Trophy size={25} />
          <p className="text-[9px]">Leaderboard</p>
        </button>
        <button onClick={() => {

          navigate("/history")
        }} className={`flex flex-col items-center justify-center ${location.pathname === "/history" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}>
          <History size={25} />
          <p className="text-[9px]">My Predictions</p>
        </button>

        <button disabled={connecting} onClick={async () => {
          try {
            if (connected_address) {
              navigate("/profile");
              return;
            }
            if (connecting) return;
            setConnecting(true)
            await handleConnect({});
            setConnecting(false)
          } catch (error: any) {
            setConnecting(false)
            console.log(error)
            toast.error(error.message || "OOPPSS");
          }
        }} className={`flex flex-col items-center justify-center ${location.pathname === "/profile" ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}>
          {connecting ? <Loader size={22} className="mr-1.5 animate-spin dark:text-white text-black " /> : !connected_address ? <Wallet /> : <CgProfile size={25} />}
          <p className="text-[9px]">{connected_address ? "Profile" : "Connect"}</p>
        </button>

      </div>
    </div>
  );
};

export default RootLayout;
