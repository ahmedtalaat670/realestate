import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload } from "lucide-react";
import apiRequest from "@/lib/apiRequest";
import { AuthContext } from "@/context/AuthContext";
import PageTitle from "@/components/PageTitle";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatar_id, setAvatar_id] = useState("");
  const [formLoader, setFormLoader] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(currentUser.avatar);
  }, [currentUser]);

  const handleFileUploadSubmit = async (e) => {
    const file = e.target.files[0];
    const imageFormData = new FormData();
    imageFormData.append("file", file);
    const response = await apiRequest
      .post("/media/upload", imageFormData)
      .catch((e) => setError(e.response.data.message));
    setAvatar(response.data.data.secure_url);
    setAvatar_id(response.data.data.public_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoader(true);
    const formData = new FormData(e.target);
    const { name, email, password } = Object.fromEntries(formData);

    if (
      name === currentUser.name &&
      email === currentUser.email &&
      password === "" &&
      (avatar === currentUser.avatar || (!avatar && !currentUser.avatar))
    ) {
      setError("You didn't make any change");
      setFormLoader(false);
      return;
    }

    try {
      const res = await apiRequest.put(`/users/${currentUser.userId}`, {
        name,
        email,
        password,
        avatar,
        avatar_id,
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setFormLoader(false);
    }
  };

  return (
    <div className="profileUpdatePage flex flex-col lg:flex-row w-full h-full p-2 md:p-0">
      <PageTitle title={"Update-Profile"} />
      {/* Form */}
      <div className="formContainer flex-3 flex items-center justify-center mb-4">
        <form
          className="flex flex-col gap-5 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-semibold text-center">Update Profile</h1>

          <div className="item flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="name"
              type="text"
              defaultValue={currentUser.name}
              className="py-3 px-2 border border-gray-400 rounded-md focus:outline-none"
            />
          </div>

          <div className="item flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              className="py-3 px-2 border border-gray-400 rounded-md focus:outline-none"
            />
          </div>

          <div className="item flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="py-3 px-2 border border-gray-400 rounded-md focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={formLoader}
            className={`p-3 rounded-md font-bold text-white cursor-pointer ${
              formLoader
                ? "bg-(--secondary-color-hover) cursor-not-allowed"
                : "bg-(--secondary-color) hover:bg-(--secondary-color-hover)"
            }`}
          >
            Update
          </button>

          {error && <span className="text-red-500">{error}</span>}
        </form>
      </div>

      {/* Side Container */}
      <div
        className={`sideContainer flex-2 bg-[#fcf5f3] flex flex-col gap-5 items-center justify-center ${avatar ? "md:flex-row" : ""} h-(calc(100vh-100px)) md:w-full`}
      >
        <img
          src={avatar || "/noavatar.jpg"}
          alt="avatar"
          className="avatar w-1/2 object-cover md:h-64 md:w-48"
        />

        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={handleFileUploadSubmit}
          className="hidden"
        />

        {avatar ? (
          <button
            onClick={() => setAvatar("")}
            className="px-5 py-3 bg-red-700 text-white rounded-lg cursor-pointer"
          >
            Replace the image
          </button>
        ) : (
          <div
            className="file w-[350px] h-[170px] border-2 border-dashed border-gray-600 flex flex-col justify-center items-center gap-5 cursor-pointer"
            onClick={() => fileRef.current.click()}
          >
            <CloudUpload className="text-gray-600" />
            <p className="text-gray-600 capitalize">
              Click or drag image to this area to upload
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
