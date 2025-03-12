import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// LAYOUTS
import RootLayout from "../layout/RootLayout";

// pages
import Home from "../pages/home/view/Home";
import Match from "../pages/match/view/Match";
import LeaderBoard from "../pages/leaderboard/view/LeaderBoard";
import Profile from "../pages/profile/view/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Match />} />
      <Route path="/home" element={<Home />} />
      {/* <Route path="/upcoming-matches" element={<Prediction />} /> */}
      <Route path="/leaderboard" element={<LeaderBoard />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="admin" element={<RootLayout />}> */}
      {/* USER MANAGEMENT PAGES */}

      {/* <Route path="*" element={<h1>404</h1>} /> */}
      {/* </Route> */}
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
