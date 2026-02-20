import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import Filter from "@/components/Filter";
import ListingCard from "@/components/ListingCard";
import apiRequest from "@/lib/apiRequest";
import { CustomPagination } from "@/components/CustomPagination";
import LoadingComponent from "@/components/LoadingComponent";
import PageTitle from "@/components/PageTitle";

export default function ListPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const postsPage = Number(searchParams.get("page")) || 1;
  const {
    data: postsData,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["list-page", location.search, postsPage],
    queryFn: async () =>
      await apiRequest.get(
        `/post/get-posts${location.search ? "" : "?"}` +
          location.search +
          `${location.search ? "&" : ""}page=${postsPage}`,
      ),
    placeholderData: (prevData) => prevData,
  });
  const handlePageChange = (newPage) => {
    setSearchParams((searchParams) => {
      searchParams.set("page", newPage);
      return searchParams;
    });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full mt-5">
      <PageTitle
        title={"Posts"}
        description={"this is the posts list to discover realestate units"}
      />
      <div className=" flex flex-col gap-12">
        <div className="px-4 flex flex-col gap-5 pb-5">
          <Filter />
          {isPending ||
          (isFetching &&
            !queryClient.getQueryData([
              "list-page",
              location.search,
              postsPage,
            ])) ? (
            <LoadingComponent number={9} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 mb-2">
              {postsData?.data.posts.map((post) => (
                <ListingCard item={post} key={post._id} />
              ))}
            </div>
          )}
          {postsData?.data.totalPages > 1 && (
            <CustomPagination
              currentPage={postsPage}
              totalPages={postsData?.data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
