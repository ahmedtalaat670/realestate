import { useContext } from "react";
import ListingCard from "./ListingCard";
import { UserContext } from "@/context/UserContext";

export default function List({ posts }) {
  const { setChatId } = useContext(UserContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-2">
      {posts?.map((item) => (
        <ListingCard
          key={item._id}
          item={item}
          onClick={() => setChatId(null)}
        />
      ))}
    </div>
  );
}
