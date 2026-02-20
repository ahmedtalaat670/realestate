import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, RequireAuth } from "./routes/Layout";
import HomePage from "./routes/Home";
import ListPage from "./routes/ListPage";
import SinglePage from "./routes/SinglPage";
import ProfilePage from "./routes/ProfilePage";
import ProfileUpdatePage from "./routes/ProfileUpdatePage";
import NewPostPage from "./routes/NewPostPage";
import Login from "./routes/Login";
import Verification from "./routes/Verification";
import RegisterPage from "./routes/RegisterPage";
import About from "./routes/About";
import Contact from "./routes/Contact-us";
import NotFound from "./routes/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
        },
        {
          path: "/posts/:id",
          element: <SinglePage />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact-us",
          element: <Contact />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/verification",
          element: <Verification />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
