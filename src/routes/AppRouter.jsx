import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import RegisterForm from "../layout/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import BillForm from "../layout/BillForm";
import FishForm from "../layout/FishFrom";
import MemberForm from "../layout/MemberForm";
import MemberManagement from "../layout/MemberManagement";
import BillManagement from "../layout/BillManagement";
import FishManagement from "../layout/FishManagement";

const guestRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      children: [
        { index: true, element: <LoginForm /> },
        { path: "/register", element: <RegisterForm /> },
      ],
    },
  ],
  { forceRefresh: true }
);

const userRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      children: [
        { index: true, path: "/home", element: <UserHome /> },
        { path: "/bill", element: <BillForm /> },
        { path: "/billList", element: <BillManagement /> },
        { path: "/fish", element: <FishForm /> },
        { path: "/fishList", element: <FishManagement /> },
        { path: "/member", element: <MemberForm /> },
        { path: "/memberList", element: <MemberManagement /> },
      ],
    },
  ],
  { forceRefresh: true }
);

export default function AppRouter() {
  const { user } = useAuth();
  const finalRouter = user?.id ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}
