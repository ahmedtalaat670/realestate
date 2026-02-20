import React, { createContext, use, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SocketContext } from "./SocketContext";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { currentUser } = use(AuthContext);
  const { socket } = use(SocketContext);
  const [posts, setPosts] = useState(null);
  const [notificationsNumber, setNotificationsNumber] = useState(0);
  const [loadingPostId, setLoadingPostId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const chatCacheRef = useRef(new Map());

  const queryClient = useQueryClient();

  const { data: notificationsData, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return await apiRequest.get("/users/notifications");
    },
    ...(location.pathname.includes("profile") && { enabled: false }),
  });

  const handleSendMessageButton = async (receiverId, postId, navigate) => {
    if (!currentUser) {
      toast.error("you need to login");
      return;
    }

    const normalizedReceiverId =
      typeof receiverId === "object" ? receiverId._id : receiverId;

    if (currentUser.userId === normalizedReceiverId) {
      toast.error("you are the owner of the post");
      return;
    }

    const cacheKey = `${currentUser.userId}-${normalizedReceiverId}`;

    // If cached → navigate instantly
    if (chatCacheRef.current.has(cacheKey)) {
      setChatId(chatCacheRef.current.get(cacheKey));
      navigate("/profile");
      return;
    }

    try {
      setLoadingPostId(postId);

      const res = await apiRequest.get(
        `/chat/get-chat-byId/${normalizedReceiverId}`,
      );

      const chatId = res?.data?.data?._id;

      if (chatId) {
        setChatId(chatId);
        chatCacheRef.current.set(cacheKey, chatId);
        navigate("/profile");
      }
    } catch (e) {
      if (e?.response?.status === 404) {
        const res2 = await apiRequest.get(
          `/chat/add-chat/${normalizedReceiverId}`,
        );

        const newChatId = res2?.data?._id;

        if (newChatId) {
          setChatId(newChatId);
          chatCacheRef.current.set(cacheKey, newChatId);
          navigate("/profile");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoadingPostId(null);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (data) => {
      queryClient.refetchQueries({ queryKey: ["chatsData"] });
      queryClient.refetchQueries({ queryKey: ["chat", data.chatId] });
      if (!location.pathname.includes("profile")) refetch();
    };
    socket?.on("getMessage", handleMessage);
    return () => {
      socket?.off("getMessage", handleMessage);
    };
  }, [socket, queryClient, refetch]);
  useEffect(() => {
    setNotificationsNumber(notificationsData?.data);
  }, [notificationsData]);

  return (
    <UserContext.Provider
      value={{
        handleSendMessageButton,
        posts,
        setPosts,
        notificationsNumber,
        setNotificationsNumber,
        loadingPostId,
        chatId,
        setChatId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
