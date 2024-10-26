import { Outlet } from "react-router-dom";
import Assets from "src/assets";
import Footer from "src/common/components/Footer";
import Header from "src/common/components/Header";
import MaxWrapper from "src/common/components/MaxWrapper";

export default function Landing() {
  return (
    <div className="size-full antialiased flex flex-col flex-1 relative bg-background/60">
      <div className="-z-10">
        <img
          src={Assets.grass}
          alt="grass"
          className="fixed top-0 left-0 size-full object-cover"
        />
      </div>
      <Header />
      <MaxWrapper className="flex-1">
        <Outlet />
      </MaxWrapper>
      <Footer />
    </div>
  );
}
