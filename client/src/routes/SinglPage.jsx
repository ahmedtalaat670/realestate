import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge"; // Optional for price highlight
import { Avatar, AvatarImage } from "@/components/ui/avatar"; // User avatar
import Slider from "@/components/Slider";
import { AuthContext } from "@/context/AuthContext";
import { UserContext } from "@/context/UserContext";
import apiRequest from "@/lib/apiRequest";
import Map from "@/components/Map";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import PageTitle from "@/components/PageTitle";
import toast from "react-hot-toast";

export function SinglePageSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen animate-pulse">
      {/* LEFT SIDE */}
      <div className="flex-3 p-4 md:p-6 lg:pr-12 space-y-8">
        {/* Slider */}
        <div className="w-full h-[40vh] md:h-[30vh] flex gap-5">
          <Skeleton className="flex-2 md:flex-3 h-full rounded-xl" />
          <div className="flex-1 h-full flex flex-col gap-5">
            <Skeleton className="w-full h-full rounded-xl" />
            <Skeleton className="w-full h-full rounded-xl" />
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        </div>

        {/* Title + User */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* User Card */}
          <div className="flex flex-col items-center gap-4 bg-muted px-12 py-4 rounded">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-2 bg-muted/40 w-full p-4 md:p-6 space-y-6">
        {/* General */}
        <Skeleton className="h-6 w-32" />
        <div className="bg-white p-4 rounded shadow space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Sizes */}
        <Skeleton className="h-6 w-20" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-28 rounded" />
          ))}
        </div>

        {/* Nearby */}
        <Skeleton className="h-6 w-36" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-32 rounded" />
          ))}
        </div>

        {/* Map */}
        <Skeleton className="h-48 w-full rounded" />

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <Skeleton className="h-14 w-44 rounded" />
          <Skeleton className="h-14 w-44 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function SinglePage() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const { handleSendMessageButton, isLoading } = useContext(UserContext);

  const { data: postData, isLoading: dataLoading } = useQuery({
    queryKey: ["post", params.id],
    queryFn: async () => await apiRequest.get(`/post/get-post/${params.id}`),
    refetchOnMount: true,
  });

  const { mutate: savePost } = useMutation({
    mutationFn: async () =>
      await apiRequest.put(`/post/save-post/${postData?.data.post._id}`),
    onMutate: async () => {
      await queryClient.cancelQueries();
      const oldPostData = queryClient.getQueryData(["post", params.id]);
      queryClient.setQueryData(["post", params.id], (oldQueryData) => ({
        ...oldQueryData,
        data: {
          ...oldQueryData.data,
          post: {
            ...oldQueryData.data.post,
            isSaved: !oldQueryData.data.post.isSaved,
          },
        },
      }));
      return { oldPostData };
    },
    onError: (_error, _, context) => {
      queryClient.setQueryData(["post", params.id], context.oldPostData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", params.id] });
      queryClient.refetchQueries({ queryKey: ["list-page"] });
    },
  });

  if (dataLoading) return <SinglePageSkeleton />;

  const post = postData?.data.post;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <PageTitle
        title={postData?.data.post.title}
        description={postData?.data.post.postDetail.desc}
      />
      {/* Details Section */}
      <div className="flex-3 p-4 md:p-6 lg:pr-12">
        <Slider images={post.images} />

        <div className="mt-8">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            {/* Post Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-normal capitalize">{post.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <img src="/pin.png" className="w-4 h-4" />
                <span>{post.address}</span>
              </div>
              <Badge className="bg-(--primary-color) text-black w-max px-2 py-1 text-lg font-light rounded">
                ${post.price}
              </Badge>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center justify-center gap-4 bg-(--primary-color) px-12 py-4 rounded">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.userId?.avatar} />
              </Avatar>
              <span className="font-semibold">{post.userId?.name}</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div
            className="mt-6 text-gray-700 leading-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.postDetail?.desc),
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="flex-2 bg-(--primary-bg-color) w-full p-4 md:p-6">
        <div className="flex flex-col gap-6">
          {/* General Features */}
          <p className="font-bold text-lg">General</p>
          <div className="flex flex-col gap-4 bg-white p-4 rounded shadow">
            <div className="flex items-center gap-3">
              <img
                src="/utility.png"
                className="w-6 h-6 bg-(--primary-color) rounded"
              />
              <div>
                <span className="font-bold">Utilities</span>
                <p>
                  {post.postDetail?.utilities === "owner"
                    ? "Owner is responsible"
                    : "Tenant is responsible"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/pet.png"
                className="w-6 h-6 bg-(--primary-color) rounded"
              />
              <div>
                <span className="font-bold">Pet Policy</span>
                <p>
                  {post.postDetail?.pet === "allowed"
                    ? "Pets Allowed"
                    : "Pets not Allowed"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/fee.png"
                className="w-6 h-6 bg-(--primary-color) rounded"
              />
              <div>
                <span className="font-bold">Income Policy</span>
                <p>{post.postDetail?.income}</p>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <p className="font-bold text-lg">Sizes</p>
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/size.png" className="w-6 h-6" />
              <span>{post.postDetail?.size} sqft</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/bed.png" className="w-6 h-6" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/bath.png" className="w-6 h-6" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>

          {/* Nearby Places */}
          <p className="font-bold text-lg">Nearby Places</p>
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/school.png" className="w-6 h-6" />
              <div>
                <span className="font-bold">School</span>
                <p>
                  {post.postDetail?.school > 999
                    ? `${post.postDetail?.school / 1000} km`
                    : `${post.postDetail?.school} m`}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/bus.png" className="w-6 h-6" />
              <div>
                <span className="font-bold">Bus Stop</span>
                <p>{post.postDetail?.bus}m away</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded">
              <img src="/restaurant.png" className="w-6 h-6" />
              <div>
                <span className="font-bold">Restaurant</span>
                <p>{post.postDetail?.restaurant}m away</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <p className="font-bold text-lg">Location</p>
          <div className="h-48 w-full rounded overflow-hidden">
            <Map items={[post]} />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                handleSendMessageButton(
                  postData?.data.post.userId._id,
                  navigate,
                );
              }}
              className="flex gap-2 items-center p-4 border border-(--secondary-color) bg-white cursor-pointer rounded-md disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner className={"animate-spin size-5"} />
              ) : (
                <img src="/chat.png" alt="" className="h-5 w-5" />
              )}
              Send a Message
            </button>
            <button
              onClick={() => {
                if (!currentUser) {
                  toast.error("you need to login");
                  return;
                }
                if (currentUser?.userId === postData?.data.post.userId._id) {
                  toast.error("you are the owner of the post");
                  return;
                }
                savePost();
              }}
              style={{
                backgroundColor: postData?.data.post.isSaved
                  ? "#fece51"
                  : "white",
              }}
              className="flex gap-2 items-center p-4 border border-(--primary-color) bg-white cursor-pointer rounded-md hover:bg-(--primary-color)"
            >
              <img src="/save.png" alt="" className="h-5 w-5" />
              {postData?.data.post.isSaved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
