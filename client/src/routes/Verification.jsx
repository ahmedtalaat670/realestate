import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import apiRequest from "@/lib/apiRequest";
import PageTitle from "@/components/PageTitle";

export default function Verification() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const verificationCode = formData.get("verification-code");

    try {
      await apiRequest.post("/auth/verify", {
        otp: verificationCode,
        email: currentUser.email,
      });
      setCurrentUser({ ...currentUser, verified: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <PageTitle title={"verification"} />
      {/* Form Section */}
      <div className="flex-3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full max-w-md"
        >
          <h1 className="text-3xl font-semibold capitalize">
            Code Verification
          </h1>

          <p className={error ? "text-red-500" : "text-gray-600"}>
            {error
              ? error
              : "We have sent you a verification code, please check your email."}
          </p>

          <Input
            type="text"
            name="verification-code"
            required
            minLength={6}
            maxLength={6}
            placeholder="Enter your verification code"
            className="py-5 px-4 border border-gray-300 rounded focus:outline-none"
          />

          <Button
            type="submit"
            disabled={loading}
            className="py-5 font-bold bg-teal-600 text-white disabled:bg-teal-200 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex flex-2 items-center justify-center bg-[#fcf5f3] ">
        <img
          src="/bg.png"
          alt="Verification"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
