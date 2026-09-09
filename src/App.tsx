import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserProfile from "./pages/UserProfilePage/UserProfilePage";
import PostDetails from "./components/posts/PostDetails";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile/Profile";
import GuestRoute from "./routes/GuestRoute";
import MainLayout from "./layout/MainLayout";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/profile", element: <Profile /> },
          { path: "/users/:userId", element: <UserProfile /> },
          { path: "/post/:postId", element: <PostDetails /> },
        ],
      },
    ],
  },

  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default function App() {

  return (
    <>
        <AuthContextProvider>
          <ToastContainer position="top-center" />
          <RouterProvider router={router} />
        </AuthContextProvider>
    </>
  );
}
