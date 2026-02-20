import { useContext, useEffect, useRef, useState } from "react";
import { ChevronRight, SendHorizontal } from "lucide-react";
import { format } from "timeago.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContext";
import { UserContext } from "@/context/UserContext";
import apiRequest from "@/lib/apiRequest";
import { Skeleton } from "./ui/skeleton";

export function ChatsSkeleton() {
  return (
    <div className="chats flex flex-col gap-[15px] py-5 h-full w-full overflow-auto">
      {Array.from({ length: 1 }).map((_, i) => (
        <div
          key={i}
          className="chat flex items-center gap-5 p-[15px_8px] rounded-md"
        >
          {/* Avatar */}
          <Skeleton className="w-[50px] h-[50px] rounded-full" />

          {/* Text */}
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>

          {/* New badge placeholder */}
          <Skeleton className="h-6 w-10 rounded-md" />
        </div>
      ))}
    </div>
  );
}

const Chat = ({ chats, isChatsLoading }) => {
  const authentication = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { setNotificationsNumber, chatId, setChatId } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [chatInfo, setChatInfo] = useState(null);

  const queryClient = useQueryClient();
  const inputRef = useRef();
  const messagesRef = useRef();

  const getReceiver = (users) => {
    return users?.find((u) => u._id !== authentication?.currentUser?.userId);
  };

  const { data: chatData, refetch: chatRefetch } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => apiRequest.get(`/chat/get-chat/${chatId}?limit=20`),
    enabled: false,
  });

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: () =>
      apiRequest.post(`/message/send-message/${chatId}`, {
        text: message,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries(["chat", chatId]);

      const previousChat = queryClient.getQueryData(["chat", chatId]);

      queryClient.setQueryData(["chat", chatId], (old = {}) => ({
        ...old,
        data: {
          ...old.data,
          messagesId: [
            ...old.data.messagesId,
            {
              userId: { _id: authentication.currentUser.userId },
              text: message,
              sending: true,
              _id: Date.now(),
            },
          ],
        },
      }));

      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

      return { previousChat };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previousChat) {
        queryClient.setQueryData(["chat", chatId], ctx.previousChat);
      }
    },

    onSuccess: (messageData) => {
      setMessage("");
      chatRefetch();
      queryClient.refetchQueries(["chatsData"]);

      socket.emit("sendMessage", {
        receiverId: getReceiver(chatData?.data.usersId)?._id,
        data: messageData?.data,
      });
    },
  });

  const handleChatClick = (c) => {
    setChatInfo({
      usersId: c.usersId,
      messagesId: [c.lastMessageId],
    });
    setChatId(c._id);
    const chatsClone = queryClient.getQueryData(["chatsData"]).data;

    const idx = chatsClone.findIndex((chat) => chat._id === c._id);
    const isSeen = chatsClone[idx].seenBy.includes(
      authentication.currentUser?.userId,
    );

    if (!isSeen) {
      setNotificationsNumber((n) => n - 1);
      chatsClone[idx].seenBy.push(authentication.currentUser.userId);

      queryClient.setQueryData(["chatsData"], (old) => ({
        ...old,
        data: chatsClone,
      }));
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      queryClient.refetchQueries(["chatsData"]);
      queryClient.refetchQueries(["chat", data.chatId]);

      if (chatId === data.chatId) {
        chatRefetch();
      }
    };

    socket.on("getMessage", handleMessage);

    return () => socket.off("getMessage", handleMessage);
  }, [socket, chatId, queryClient, chatRefetch]);

  useEffect(() => {
    const markAsSeen = async () => {
      const isSeen = chatData?.data.seenBy.includes(
        authentication.currentUser?.userId,
      );
      if (!isSeen && chatId === chatData?.data._id) {
        return await apiRequest.put(`/chat/read-chat/${chatData?.data._id}`);
      }
    };
    if (chatInfo) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      inputRef.current?.focus();
    }
    markAsSeen();
  }, [chatData, chatId, authentication, chatInfo]);

  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === "Escape") {
        if (chatId && chatInfo) {
          setChatId(null);
          setChatInfo(null);
        }
      }
    };
    document.addEventListener("keydown", handleEscPress);
    return () => document.removeEventListener("keydown", handleEscPress);
  }, [chatId, chatInfo, setChatId]);
  useEffect(() => {
    if (chatId) chatRefetch();
  }, [chatId, chatRefetch]);
  useEffect(() => {
    if (chatData?.data) setChatInfo(chatData?.data);
  }, [chatData]);
  return (
    <div className="flex">
      {/* LEFT PANEL – CHAT LIST */}
      {
        <div
          className={`flex flex-col gap-[15px] py-5 h-full w-full overflow-auto ${
            chatId ? "hidden" : ""
          }`}
        >
          {isChatsLoading ? (
            <ChatsSkeleton />
          ) : (
            chats?.map((chat) => {
              const receiver = getReceiver(chat.usersId);
              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatClick(chat)}
                  className="chat flex items-center gap-5 p-[15px_8px] cursor-pointer rounded-md relative hover:bg-(--primary-color)"
                >
                  <div className="avatar bg-gray-300 rounded-full w-[50px] h-[50px]">
                    <img
                      src={receiver?.avatar || "noavatar.jpg"}
                      className="w-full h-full object-cover rounded-full"
                      alt=""
                    />
                  </div>

                  <div className="chat-text flex flex-col items-start gap-1">
                    <div className="name text-[20px]">{receiver?.name}</div>
                    <div className="last-message text-[14px] text-gray-500">
                      {chat.lastMessageId?.text}
                    </div>
                  </div>

                  {!chat.seenBy.includes(
                    authentication.currentUser?.userId,
                  ) && (
                    <div className="new-messages absolute right-10 p-[5px] bg-teal-600 text-white rounded-lg">
                      new
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      }

      {/* CHAT WINDOW */}
      <div
        className={`flex flex-col justify-between items-center h-[calc(100vh-150px)] w-full relative ${
          chatId ? "" : "hidden"
        }`}
      >
        {/* TOP BAR */}
        <div className="top flex items-center justify-between p-2 bg-white rounded-md w-full mt-2 sticky top-0 right-0 z-10">
          {chatInfo ? (
            <div className="flex items-center gap-2">
              <div className="avatar w-[50px] h-[50px]">
                <img
                  src={getReceiver(chatInfo?.usersId)?.avatar || "noavatar.jpg"}
                  className="w-full h-full rounded-full"
                  alt=""
                />
              </div>
              <div className="title text-[20px]">
                {getReceiver(chatInfo?.usersId)?.name}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Skeleton className={"w-[50px] h-[50px] rounded-full"} />
              <Skeleton className={"w-32 h-2 rounded-lg"} />
            </div>
          )}

          <div
            className="back w-10 h-10 flex justify-center items-center cursor-pointer rounded-lg hover:bg-teal-600 hover:text-white"
            onClick={() => {
              setChatInfo(null);
              setChatId(null);
            }}
          >
            <ChevronRight />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="w-full min-h-0 flex flex-1">
          <div ref={messagesRef} className="w-full overflow-y-auto">
            <div className="w-full flex flex-col justify-end min-h-full gap-[30px] p-5">
              {chatInfo?.messagesId.map((msg) => {
                const isMine =
                  msg.userId?._id === authentication.currentUser?.userId;

                return (
                  <div
                    key={msg._id}
                    className={`message p-2.5 rounded-lg relative flex flex-wrap max-w-[80%] ${
                      isMine
                        ? "self-start bg-(--primary-color)"
                        : "self-end bg-white"
                    }`}
                  >
                    {msg.text}

                    {msg.createdAt && (
                      <span
                        className={`absolute text-[10px] text-gray-500 bottom-[-15px] ${
                          isMine ? "left-0" : "right-0"
                        }`}
                      >
                        {format(msg.createdAt)}
                      </span>
                    )}

                    {msg.sending && (
                      <div className="ml-1 text-gray-500 text-[13px]">
                        (sending)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="bottom w-full relative pb-2">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              placeholder="send message"
              value={message}
              ref={inputRef}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full py-[25px] px-2.5 rounded-lg text-[15px] caret-(--secondary-color) border-none focus:outline-none bg-white"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 top-[15px] bg-(--secondary-color) text-white p-1.5 rounded-lg disabled:opacity-50"
            >
              <SendHorizontal />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
