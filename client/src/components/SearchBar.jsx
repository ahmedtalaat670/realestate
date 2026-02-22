import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
const types = ["buy", "rent"];

function SearchBar() {
  const [type, setType] = useState("buy");
  const nav = useNavigate();
  const formSchema = z.object({
    city: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce
      .number()
      .positive("the maximum price must be greater than 0"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (data) => {
    nav(
      `/list?type=${type}&city=${data.city}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}`,
    );
  };
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Type buttons */}
      <div className="flex border border-gray-400 rounded-t-md overflow-hidden">
        {types.map((t, idx) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 py-4 px-8 capitalize transition-colors ${
              type === t
                ? "bg-black text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            } ${idx === 0 ? "rounded-tl-md" : ""} ${
              idx === types.length - 1 ? "rounded-tr-md" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            {...register("city")}
            placeholder="City"
            className="flex-1 px-2 py-4 focus:outline-none bg-gray-100 rounded-lg"
          />
          {errors.city && (
            <div className="text-red-500"> {errors.city.message}</div>
          )}
          <input
            type="number"
            {...register("minPrice")}
            placeholder="Min Price"
            className="flex-1 px-2 py-4 focus:outline-none bg-gray-100 rounded-lg"
          />
          {errors.minPrice && (
            <div className="text-red-500"> {errors.minPrice.message}</div>
          )}

          <input
            type="number"
            {...register("maxPrice")}
            placeholder="Max Price"
            className="flex-1 px-2 py-4 focus:outline-none bg-gray-100 rounded-lg"
          />
          {errors.maxPrice && (
            <div className="text-red-500"> {errors.maxPrice.message}</div>
          )}
        </div>
        {/* <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          className="flex-1 sm:flex-none"
        > */}
        <button
          type="submit"
          className="w-full py-4 rounded-lg bg-(--primary-color) hover:bg-(--primary-color-hover) cursor-pointer flex justify-center items-center"
        >
          <img src="/search.png" alt="search" className="w-6 h-6" />
        </button>
        {/* </Link> */}
      </form>
    </div>
  );
}

export default SearchBar;
