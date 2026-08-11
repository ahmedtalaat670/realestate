import { ChevronRight, SendHorizontal } from "lucide-react";
import { format } from "timeago.js";

import { Skeleton } from "../ui/skeleton";

const NO_AVATAR = "/noavatar.jpg";

const ChatWindow = ({
  chatId,
  chatInfo,
  getReceiver,
  setChatId,
  setChatInfo,
  messagesRef,
  inputRef,
  currentUserId,
  message,
  setMessage,
  sendMessage,
}) => {
  const receiver = chatInfo ? getReceiver(chatInfo.usersId) : null;

  const handleCloseChat = () => {
    setChatInfo(null);
    setChatId(null);
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    sendMessage();
  };

  return (
    <div
      className={`relative flex h-[calc(100vh-150px)] w-full flex-col items-center justify-between ${
        chatId ? "" : "hidden"
      }`}
    >
      {/* ============================================================
          TOP BAR
      ============================================================ */}
      <div className="sticky right-0 top-0 z-10 mt-2 flex w-full items-center justify-between rounded-md bg-white p-2">
        {chatInfo ? (
          <div className="flex min-w-0 items-center gap-2">
            {/* Avatar */}
            <div className="h-[50px] w-[50px] shrink-0">
              <img
                src={receiver?.avatar || NO_AVATAR}
                className="h-full w-full rounded-full object-cover"
                alt={receiver?.name || "User avatar"}
              />
            </div>

            {/* Name */}
            <div className="truncate text-[20px]">
              {receiver?.name || "Unknown user"}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Skeleton className="h-[50px] w-[50px] rounded-full" />
            <Skeleton className="h-2 w-32 rounded-lg" />
          </div>
        )}

        {/* Close / Back */}
        <button
          type="button"
          aria-label="Close chat"
          onClick={handleCloseChat}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-teal-600 hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>

      {/* ============================================================
          MESSAGES
      ============================================================ */}
      <div className="flex min-h-0 w-full flex-1">
        <div ref={messagesRef} className="w-full overflow-y-auto">
          <div className="flex min-h-full w-full flex-col justify-end gap-[30px] p-5">
            {chatInfo?.messagesId?.length ? (
              chatInfo.messagesId.map((msg) => {
                const isMine = msg.userId?._id === currentUserId;

                return (
                  <div
                    key={msg._id}
                    className={`relative flex max-w-[80%] flex-wrap rounded-lg p-2.5 ${
                      isMine
                        ? "self-start bg-(--primary-color)"
                        : "self-end bg-white"
                    }`}
                  >
                    {/* Message text */}
                    <span className="break-words">{msg.text}</span>

                    {/* Sending state */}
                    {msg.sending && (
                      <span className="ml-1 text-[13px] text-gray-500">
                        (sending)
                      </span>
                    )}

                    {/* Timestamp */}
                    {msg.createdAt && (
                      <span
                        className={`absolute bottom-[-15px] text-[10px] text-gray-500 ${
                          isMine ? "left-0" : "right-0"
                        }`}
                      >
                        {format(msg.createdAt)}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-full items-center justify-center text-gray-500">
                No messages yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          MESSAGE INPUT
      ============================================================ */}
      <div className="relative w-full pb-2">
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-lg border-none bg-white px-2.5 py-[25px] text-[15px] caret-(--secondary-color) focus:outline-none"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            aria-label="Send message"
            className="absolute right-2 top-[15px] rounded-lg bg-(--secondary-color) p-1.5 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
