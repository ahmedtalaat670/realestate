import PageTitle from "@/components/PageTitle";
import { AuthContext } from "@/context/AuthContext";
import apiRequest from "@/lib/apiRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRef,
  useState,
  useOptimistic,
  useEffect,
  startTransition,
  useContext,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import z from "zod";

function NewPostPage() {
  const [images, setImages] = useState([]);
  const nav = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const fileRef = useRef();
  const [currentImages, updateImages] = useOptimistic(
    images,
    (state, deletedId) => state.filter((img) => img.image_id !== deletedId),
  );

  const authInformation = useContext(AuthContext);

  const formSchema = z.object({
    title: z.string().min(3, "the title should includes at least 3 letters"),
    price: z.coerce.number().positive("the price should be greater than 0"),
    address: z
      .string()
      .min(3, "the address should at least includes 3 letters"),
    city: z.string().min(3, "the city should includes at least 3 letters"),
    bedroom: z.coerce
      .number()
      .positive("the bedroom number should be greater than 0"),
    bathroom: z.coerce
      .number()
      .positive("the bathroom number should be greater than 0"),
    type: z.string().min(1, "the type property should not be empty"),
    property: z.string().min(1, "the property property should not be empty"),
    latitude: z
      .string()
      .min(1, "Latitude is required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Latitude must be a number",
      })
      .transform((val) => Number(val))
      .refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
    longitude: z
      .string()
      .min(1, "Longitude is required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Longitude must be a number",
      })
      .transform((val) => Number(val))
      .refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
    desc: z.string().min(1, "the description property should not be empty"),
    utilities: z.string().min(1, "the utilities property should not be empty"),
    pet: z.string().min(1, "the pet property should not be empty"),
    size: z.coerce
      .number()
      .positive("the size of the property should be greater than 0"),
    school: z.coerce
      .number()
      .positive(
        "the distance between the school and the property should be greater than 0",
      ),
    bus: z.coerce
      .number()
      .positive(
        "the distance between the bus and the property should be greater than 0",
      ),
    restaurant: z.coerce
      .number()
      .positive(
        "the distance between the restaurant and the property should be greater than 0",
      ),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const handleImagesUpload = async (e) => {
    setIsPending(true);
    const files = e.target.files;
    const formData = new FormData();
    [...files].forEach((file) => formData.append("files", file));

    try {
      const res = await apiRequest.post("/media/bulk-upload", formData);
      setImages((prev) => [
        ...prev,
        ...res.data.data.map((img) => ({
          imageUrl: img.secure_url,
          image_id: img.public_id,
        })),
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteButton = async (index) => {
    const id = images[index].image_id;
    updateImages(id);

    try {
      startTransition(async () => {
        const res = await apiRequest.delete(`/media/delete/${id}`);
        if (res.data.success) {
          setImages((prev) => prev.filter((_, i) => i !== index));
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    if (images.length !== 4) {
      setError("root", { message: "number of images must be 4" });
      return;
    }

    try {
      const res = await apiRequest.post("/post/add-post", {
        title: data.title,
        price: Number(data.price),
        address: data.address,
        city: data.city,
        bedroom: Number(data.bedroom),
        bathroom: Number(data.bathroom),
        type: data.type,
        property: data.property,
        latitude: data.latitude,
        longitude: data.longitude,
        images,
        userId: authInformation.currentUser.userId,
        postDetail: {
          desc: data.desc,
          utilities: data.utilities,
          pet: data.pet,
          income: data.income,
          size: Number(data.size),
          school: Number(data.school),
          bus: Number(data.bus),
          restaurant: Number(data.restaurant),
        },
      });
      if (res.data.success) {
        nav("/profile");
        toast.success("you created new post successfully");
      }
    } catch (err) {
      setError("root", { message: err.response.data.message });
    }
  };

  useEffect(() => {
    console.log(currentImages);
  }, [currentImages]);

  return (
    <div className="flex flex-col md:flex-row">
      <PageTitle title={"New-Post"} />
      {/* FORM */}
      <div className="flex-3 ">
        <div className="mt-8 mr-5 md:mr-12  mb-24 pl-5">
          <h1 className="mb-5 text-2xl font-semibold">Add New Post</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap gap-5"
          >
            {[
              ["title", "Title"],
              ["price", "Price", "number"],
              ["address", "Address"],
              ["city", "City"],
              ["bedroom", "Bedroom Number", "number"],
              ["bathroom", "Bathroom Number", "number"],
              ["latitude", "Latitude"],
              ["longitude", "Longitude"],
              ["size", "Size", "number"],
              ["school", "School", "number"],
              ["bus", "Bus", "number"],
              ["restaurant", "Restaurant", "number"],
            ].map(([name, label, type = "text"]) => (
              <div
                key={name}
                className="w-[45%] md:w-[30%] flex flex-col gap-1"
              >
                <label className="capitalize">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  className="p-5 border border-gray-400 rounded-md"
                />
                {errors[name] && (
                  <div className="text-red-500">{errors[name].message}</div>
                )}
              </div>
            ))}

            {/* DESCRIPTION */}
            <div className="w-full h-80 flex flex-col gap-1">
              <label>Description</label>
              <textarea
                {...register("desc")}
                className="h-full p-4 text-lg resize-none border border-gray-400 rounded-md"
              />
              {errors.desc && (
                <div className="text-red-500">{errors.desc.message}</div>
              )}
            </div>

            {/* SELECTS */}
            {[
              ["type", ["rent", "buy"]],
              ["property", ["apartment", "house", "condo", "land"]],
              ["utilities", ["owner", "tenant", "shared"]],
              ["pet", ["allowed", "not-allowed"]],
            ].map(([name, options]) => (
              <div
                key={name}
                className="w-[45%] md:w-[30%] flex flex-col gap-1"
              >
                <label className="capitalize">{name}</label>
                <select
                  {...register(name)}
                  className="border py-5 px-1 border-gray-400 rounded-md"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors[name] && (
                  <div className="text-red-500">{errors[name].message}</div>
                )}
              </div>
            ))}

            {/* FILE UPLOAD */}
            <div className="w-[45%] md:w-[30%] flex flex-col gap-1">
              <label>Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileRef}
                onChange={handleImagesUpload}
                className="hidden"
              />
              <div
                onClick={() => !isPending && fileRef.current.click()}
                className={`p-5 rounded-md text-center cursor-pointer font-medium tracking-wide hover:bg-(--primary-color-hover) ${
                  isPending
                    ? "bg-(--primary-color-hover) cursor-not-allowed"
                    : "bg-(--primary-color)"
                }`}
              >
                Upload
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[45%] md:w-[30%] capitalize cursor-pointer rounded-md bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white font-bold disabled:bg-(--secondary-color-hover) disabled:cursor-not-allowed"
            >
              add
            </button>

            {errors.root && (
              <span className="text-red-500">{errors.root.message}</span>
            )}
          </form>
        </div>
      </div>

      {/* IMAGES */}
      <div className="flex-2 bg-[#fcf5f3]">
        <div className="p-5 flex flex-wrap justify-center gap-5">
          {currentImages.map((img, index) => (
            <div
              key={img.image_id}
              className="relative w-[40%] h-44 md:w-full group"
            >
              <img
                src={img.imageUrl}
                alt=""
                className="w-full h-full object-cover rounded-md"
              />
              <span
                onClick={() => handleDeleteButton(index)}
                className="hidden group-hover:block absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full cursor-pointer opacity-0 md:opacity-100"
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
