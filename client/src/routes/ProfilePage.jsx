import { Link, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import apiRequest from "@/lib/apiRequest";
import Chat from "@/components/Chat";
import List from "@/components/List";
import { CustomPagination } from "@/components/CustomPagination";
import LoadingComponent from "@/components/LoadingComponent";
import PageTitle from "@/components/PageTitle";

function ProfilePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const { setNotificationsNumber } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const userPostsPage = Number(searchParams.get("userPosts_page")) || 1;
  const userSavedPostsPage = Number(searchParams.get("saved_page")) || 1;
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    queryClient.removeQueries({ type: "all" });
    try {
      const res = await apiRequest.post("/auth/logout");
      if (res) {
        window.location.pathname = "/login";
        updateUser(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const {
    data: userPostsData,
    isPending: isUserPosDatPending,
    isFetching: isUserPosDatFetching,
  } = useQuery({
    queryKey: ["userPosts", userPostsPage],
    queryFn: async () =>
      apiRequest.get(`/users/user-posts?page=${userPostsPage}`),
    placeholderData: (prevData) => prevData,
  });
  const {
    data: userSavedPostsData,
    isFetching: isSavPosDatFetching,
    isPending: isSavPosDatPending,
  } = useQuery({
    queryKey: ["userSavedPosts", userSavedPostsPage],
    queryFn: async () =>
      apiRequest.get(`/users/user-savedPosts?page=${userSavedPostsPage}`),
    placeholderData: (prevData) => prevData,
  });

  const {
    data: chatsData,
    isSuccess,
    isLoading: isChatsLoading,
  } = useQuery({
    queryKey: ["chatsData"],
    queryFn: async () => apiRequest.get("/chat/get-chats"),
  });
  const handleSavPosPagChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("saved_page", newPage);
      return params;
    });
  };
  const handleUserPosPagChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("userPosts_page", newPage);
      return params;
    });
  };
  useEffect(() => {
    if (isSuccess) setNotificationsNumber(0);
  }, [isSuccess, setNotificationsNumber]);

  return (
    <div className="profilePage flex flex-col h-full lg:flex-row">
      <PageTitle title={"Profile"} />
      {/* LEFT PANEL: User Info & Lists */}
      <div className="flex-3  lg:overflow-y-auto pt-5">
        <div className="wrapper flex flex-col gap-12 px-5 mb-5">
          {/* User Info Header */}
          <div className="title flex items-center justify-between">
            <h1 className="font-light text-2xl">User Information</h1>
            <Link to="/profile/update">
              <button className="px-6 py-3 bg-(--primary-color) rounded-md hover:bg-(--primary-color-hover) cursor-pointer">
                Update Profile
              </button>
            </Link>
          </div>

          {/* User Info */}
          <div className="info flex flex-col gap-5">
            <span className="flex items-center gap-5">
              Avatar:
              <img
                src={currentUser?.avatar || "noavatar.jpg"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </span>
            <span>
              Username: <b>{currentUser?.name}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button
              disabled={isLogoutLoading}
              onClick={handleLogout}
              className="w-24 bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* My List */}
          <div className="title flex items-center justify-between">
            <h1 className="font-light text-2xl">My List</h1>
            <Link to="/add">
              <button className="px-6 py-3 bg-(--primary-color) rounded-md hover:bg-(--primary-color-hover) cursor-pointer">
                Create New Post
              </button>
            </Link>
          </div>
          {isUserPosDatPending ||
          (isUserPosDatFetching &&
            !queryClient.getQueryData(["userPosts", userPostsPage])) ? (
            <LoadingComponent number={4} />
          ) : (
            <List posts={userPostsData?.data.posts} />
          )}
          {userPostsData?.data.totalPages > 1 && (
            <CustomPagination
              currentPage={userPostsPage}
              onPageChange={handleUserPosPagChange}
              totalPages={userPostsData?.data.totalPages}
            />
          )}

          {/* Saved List */}
          <div className="title">
            <h1 className="font-light text-2xl">Saved List</h1>
          </div>
          {isSavPosDatPending ||
          (isSavPosDatFetching &&
            !queryClient.getQueryData([
              "userSavedPosts",
              userSavedPostsPage,
            ])) ? (
            <LoadingComponent number={4} />
          ) : (
            <List posts={userSavedPostsData?.data.posts} />
          )}
          {userSavedPostsData?.data.totalPages > 1 && (
            <CustomPagination
              currentPage={userSavedPostsPage}
              onPageChange={handleSavPosPagChange}
              totalPages={userSavedPostsData?.data.totalPages}
            />
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Chat */}
      <div className="flex-2 bg-(--primary-bg-color)">
        <div className="wrapper h-full">
          <Chat chats={chatsData?.data} isChatsLoading={isChatsLoading} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
