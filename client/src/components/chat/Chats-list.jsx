const ChatsList = ({
  chats = [],
  getReceiver,
  handleChatClick,
  currentUserId,
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        No chats yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[15px]">
      {chats.map((chat) => {
        const receiver = getReceiver(chat.usersId);

        const isUnread = currentUserId && !chat.seenBy?.includes(currentUserId);

        return (
          <button
            key={chat._id}
            type="button"
            onClick={() => handleChatClick(chat)}
            className="relative flex w-full items-center gap-5 rounded-md p-[15px_8px] text-left transition-colors hover:bg-(--primary-color)"
          >
            {/* Avatar */}
            <div className="h-[55px] w-[55px] shrink-0">
              <img
                src={receiver?.avatar || "/noavatar.jpg"}
                className="h-full w-full rounded-full object-cover"
                alt={receiver?.name || "User avatar"}
              />
            </div>

            {/* Chat information */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[20px]">
                {receiver?.name || "Unknown user"}
              </div>

              <div className="truncate text-[14px] text-gray-500">
                {chat.lastMessageId?.text || "No messages yet"}
              </div>
            </div>

            {/* Unread indicator */}
            {isUnread && (
              <span className="absolute right-10 rounded-lg bg-teal-600 px-2 py-1 text-xs text-white">
                New
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChatsList;
