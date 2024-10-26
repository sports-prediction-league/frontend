import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../App";
import Home from "../pages/home/views/Home";
import Landing from "../layouts/Landing";

import DashboardLayout from "src/layouts/DashboardLayout";
import Profile from "src/pages/dashboard/views/Profile";
import Leaderboard from "src/pages/dashboard/views/Leaderboard";
import UpcomingMatches from "src/pages/dashboard/views/UpcomingMatches";

export const pageRoutes = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
   

      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "/upcoming-matches",
            element: <UpcomingMatches />,
          },
        ],
      },
    ],
  },
]);
