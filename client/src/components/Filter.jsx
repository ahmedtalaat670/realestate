import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="w-full p-4 flex flex-col gap-6 bg-white rounded-lg border shadow-sm">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">
        Search results for{" "}
        <b className="text-teal-600">{searchParams.get("city")}</b>
      </h1>

      {/* TOP Section (Location Input) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">
            Location
          </label>

          <Input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
            className="w-full"
          />
        </div>
      </div>

      {/* BOTTOM FILTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <Select
            defaultValue={query.type}
            onValueChange={(value) =>
              setQuery((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="choose the type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Property</label>
          <Select
            defaultValue={query.property}
            onValueChange={(value) =>
              setQuery((prev) => ({ ...prev, property: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min price */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Min Price</label>
          <Input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>

        {/* Max price */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Max Price</label>
          <Input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>

        {/* Bedroom */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Bedroom</label>
          <Input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleFilter}
            className="cursor-pointer w-full bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white p-3 flex justify-center items-center rounded-md"
          >
            <img src="/search.png" alt="search" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
