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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />

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
