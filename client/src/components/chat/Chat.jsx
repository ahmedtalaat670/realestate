import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContext";
import { UserContext } from "@/context/UserContext";
import apiRequest from "@/lib/apiRequest";

import { ChatsSkeleton } from "./Chat-skeleton";
import ChatsList from "./Chats-list";
import ChatWindow from "./Chat-window";

const Chat = ({ chats, isChatsLoading }) => {
  const authentication = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const { setNotificationsNumber, chatId, setChatId } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [chatInfo, setChatInfo] = useState(null);

  const queryClient = useQueryClient();

  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  const currentUserId = authentication?.currentUser?.userId;

  const getReceiver = useCallback(
    (users) => {
      return users?.find((user) => user._id !== currentUserId);
    },
    [currentUserId],
  );

  {
    /*Fetching the cahts*/
  }
  const { data: chatData, refetch: chatRefetch } = useQuery({
    queryKey: ["chat", chatId],

    queryFn: () => apiRequest.get(`/chat/get-chat/${chatId}?limit=20`),

    enabled: false,
  });

  {
    /*Sending messages*/
  }
  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],

    mutationFn: () =>
      apiRequest.post(`/message/send-message/${chatId}`, {
        text: message,
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["chat", chatId],
      });

      const previousChat = queryClient.getQueryData(["chat", chatId]);

      queryClient.setQueryData(["chat", chatId], (old = {}) => {
        if (!old?.data) {
          return old;
        }

        return {
          ...old,

          data: {
            ...old.data,

            messagesId: [
              ...(old.data.messagesId ?? []),

              {
                userId: {
                  _id: currentUserId,
                },

                text: message,

                sending: true,

                _id: Date.now(),
              },
            ],
          },
        };
      });

      requestAnimationFrame(() => {
        if (!messagesRef.current) return;

        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      });

      return {
        previousChat,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context?.previousChat) return;

      queryClient.setQueryData(["chat", chatId], context.previousChat);
    },

    onSuccess: (messageData) => {
      setMessage("");

      queryClient.invalidateQueries({
        queryKey: ["chatsData"],
      });

      queryClient.invalidateQueries({
        queryKey: ["chat", chatId],
      });

      const receiver = getReceiver(chatData?.data?.usersId);

      if (!receiver || !socket) return;

      socket.emit("sendMessage", {
        receiverId: receiver._id,
        data: messageData?.data,
      });
    },
  });

  {
    /*opening the chat tab*/
  }
  const handleChatClick = useCallback(
    (chat) => {
      setChatInfo({
        usersId: chat.usersId,

        messagesId: chat.lastMessageId ? [chat.lastMessageId] : [],
      });

      setChatId(chat._id);

      const chatsData = queryClient.getQueryData(["chatsData"]);

      if (!chatsData?.data) return;

      const selectedChat = chatsData.data.find((item) => item._id === chat._id);

      if (!selectedChat) return;

      const isSeen = selectedChat.seenBy?.includes(currentUserId);

      if (isSeen) return;

      setNotificationsNumber((count) => Math.max(0, count - 1));
      queryClient.setQueryData(["chatsData"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,

          data: old.data.map((item) => {
            if (item._id !== chat._id) {
              return item;
            }

            return {
              ...item,

              seenBy: [...(item.seenBy ?? []), currentUserId],
            };
          }),
        };
      });
    },
    [currentUserId, queryClient, setChatId, setNotificationsNumber],
  );

  {
    /*receiving a message*/
  }
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      queryClient.invalidateQueries({
        queryKey: ["chatsData"],
      });

      queryClient.invalidateQueries({
        queryKey: ["chat", data.chatId],
      });
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, queryClient]);

  {
    /*handling the chat data change*/
  }
  useEffect(() => {
    if (!chatData?.data) return;

    setChatInfo(chatData.data);
  }, [chatData]);

  {
    /*scrolling to the bottom when you open the chat tab*/
  }
  useEffect(() => {
    if (!chatInfo) return;

    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }

      inputRef.current?.focus();
    });
  }, [chatInfo]);

  {
    /*marking the chat as seen when you open the chat tab*/
  }
  useEffect(() => {
    if (!chatData?.data || !chatId || !currentUserId) {
      return;
    }

    const isSeen = chatData.data.seenBy?.includes(currentUserId);

    if (isSeen) return;

    const markAsSeen = async () => {
      try {
        await apiRequest.put(`/chat/read-chat/${chatData.data._id}`);
      } catch (error) {
        console.error("Failed to mark chat as seen:", error);
      }
    };

    markAsSeen();
  }, [chatData, chatId, currentUserId]);

  {
    /"refetching the chat info when you change the chatId"/;
  }
  useEffect(() => {
    if (!chatId) return;

    chatRefetch();
  }, [chatId, chatRefetch]);

  {
    /*handling when you click the ESC button*/
  }
  useEffect(() => {
    const handleEscPress = (event) => {
      if (event.key !== "Escape") return;

      if (!chatId || !chatInfo) return;

      setChatId(null);
      setChatInfo(null);
    };

    document.addEventListener("keydown", handleEscPress);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [chatId, chatInfo, setChatId]);

  return (
    <div className="flex h-full w-full">
      <div
        className={`flex h-full w-full flex-col overflow-auto ${
          chatId ? "hidden" : ""
        }`}
      >
        {isChatsLoading ? (
          <ChatsSkeleton />
        ) : (
          <ChatsList
            chats={chats}
            getReceiver={getReceiver}
            handleChatClick={handleChatClick}
            currentUserId={currentUserId}
          />
        )}
      </div>

      <ChatWindow
        chatId={chatId}
        chatInfo={chatInfo}
        getReceiver={getReceiver}
        setChatId={setChatId}
        setChatInfo={setChatInfo}
        messagesRef={messagesRef}
        inputRef={inputRef}
        currentUserId={currentUserId}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
