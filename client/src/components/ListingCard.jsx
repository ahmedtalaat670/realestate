import { Link, useLocation, useNavigate } from "react-router-dom";
import { use, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import apiRequest from "@/lib/apiRequest";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Spinner } from "./ui/spinner";
import toast from "react-hot-toast";

export default function ListingCard({ item }) {
  const { currentUser } = use(AuthContext);
  const { handleSendMessageButton, isLoading } = use(UserContext);
  const [isSaved, setIsSaved] = useState(item.isSaved);
  const [cardId, setCardId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      await apiRequest.put(`/post/save-post/${item._id}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries();
      const saved = item.isSaved;
      setIsSaved((prev) => !prev);
      return { saved };
    },
    onError: (_error, _, context) => {
      setIsSaved(context.saved);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["list-page"]);

      queryClient.refetchQueries(["post", item._id]);
    },
  });
  const handleSaveButton = () => {
    if (!currentUser) {
      toast.error("you need to login");
      return;
    }
    if (currentUser?.userId === item.userId) {
      toast.error("you are the owner of the post");
      return;
    }
    mutate();
  };

  return (
    <Card onClick={() => setCardId(item._id)}>
      {/* IMAGE */}
      <Link to={`/posts/${item._id}`} className="w-full h-[200px] bg-gray-200">
        <img
          src={item.images?.[0]?.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </Link>
      {/* TEXT CONTENT */}
      <CardContent className="flex-1">
        {/* Title */}
        <Link to={`/posts/${item._id}`}>
          <h2 className="text-xl font-semibold text-gray-700 hover:text-black transition mb-2">
            {item.title}
          </h2>
        </Link>
        {/* Address */}
        <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <img src="/pin.png" className="w-4 h-4" />
          <span className="truncate capitalize">{item.address}</span>
        </p>

        {/* Price */}
        <p className="text-xl font-light  w-fit rounded bg-yellow-300/40 mb-2">
          ${item.price}
        </p>

        {/* Bottom Section */}
        <div className="flex items-center justify-between mb-2">
          {/* Features */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
              <img src="/bed.png" className="w-4 h-4" />
              <span>{item.bedroom} bedroom</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
              <img src="/bath.png" className="w-4 h-4" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>

          {/* Icons */}
          <div className="flex gap-4">
            {/* Save Icon */}
            {!location.pathname.includes("profile") && (
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={handleSaveButton}
                    className={cn(
                      "border border-gray-400 p-1.5 cursor-pointer transition rounded-md",

                      isSaved && "bg-(--primary-color)",
                    )}
                  >
                    <img src="/save.png" className="w-5 h-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[15px]">save the post</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Chat Icon */}
            <Tooltip>
              <TooltipTrigger
                onClick={() => {
                  handleSendMessageButton(item.userId, navigate);
                }}
                className={`border border-gray-400 p-1.5 rounded-md cursor-pointer transition disabled:cursor-not-allowed ${
                  cardId === item._id && isLoading ? "opacity-50" : ""
                }`}
                disabled={isLoading}
              >
                {cardId === item._id && isLoading ? (
                  <Spinner className={"animate-spin size-5"} />
                ) : (
                  <img src="/chat.png" className="w-5 h-5" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[15px]">chat with the owner</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
