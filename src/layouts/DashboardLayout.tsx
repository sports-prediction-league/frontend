import { NavLink, Outlet } from "react-router-dom";
import Assets from "src/assets";
import Button from "src/common/components/Button";
import Footer from "src/common/components/Footer";
import Header from "src/common/components/Header";
import MaxWrapper from "src/common/components/MaxWrapper";

export default function DashboardLayout() {
  return (
    <div className="w-full antialiased flex flex-col flex-1 relative bg-background/60">
      <div className="-z-10">
        <img
          src={Assets.grass}
          alt="grass"
          className="fixed top-0 left-0 size-full object-cover"
        />
      </div>
      <Header />
      <MaxWrapper className="py-4 flex-1">
        <div className="flex flex-col">
          <div className="rounded-lg rounded-b-none bg-background p-2 flex flex-col">
            <div className="w-full flex items-center flex-wrap justify-end gap-3 relative px-2 md:px-8 py-4 md:py-14 overflow-hidden rounded-md">
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                alt=""
                src={Assets.dashboardGrass}
              />
              <NavLink
                to="/profile"
                children={({ isActive }) => (
                  <Button
                    className={`!w-max !px-4 relative !text-sm md:!text-base ${
                      !isActive ? "!bg-background !text-white" : ""
                    }`}
                  >
                    PROFILE
                  </Button>
                )}
              />
              <NavLink
                to="/leaderboard"
                children={({ isActive }) => (
                  <Button
                    className={`!w-max !px-4 relative !text-sm md:!text-base ${
                      !isActive ? "!bg-background !text-white" : ""
                    }`}
                  >
                    LEADERBOARD
                  </Button>
                )}
              />
              <NavLink
                to="/upcoming-matches"
                children={({ isActive }) => (
                  <Button
                    className={`!w-max !px-4 relative !text-sm md:!text-base ${
                      !isActive ? "!bg-background !text-white" : ""
                    }`}
                  >
                    UPCOMING MATCHES
                  </Button>
                )}
              />
            </div>

            <Outlet />
          </div>
        </div>
      </MaxWrapper>
      <Footer />
    </div>
  );
}
