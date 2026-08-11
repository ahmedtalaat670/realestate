import { Skeleton } from "../ui/skeleton";

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
