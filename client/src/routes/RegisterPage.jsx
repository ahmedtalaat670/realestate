import PageTitle from "@/components/PageTitle";
import { AuthContext } from "@/context/AuthContext";
import apiRequest from "@/lib/apiRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

const registerForm = [
  {
    name: "username",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    name: "email",
    type: "text",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter a strong password",
  },
];

function Register() {
  const { updateUser } = useContext(AuthContext);
  const formSchema = z.object({
    username: z
      .string()
      .min(3, "the username length must be greater than 2")
      .max(15, "the username length should not be greater than 15"),
    email: z.string().email(),
    password: z
      .string()
      .min(6, "the password length should not be less than 6")
      .regex(/[a-z]/, "the password must contain one small letter")
      .regex(/[A-Z]/, "the password must contain one capital letter")
      .max(15, "the password length should not be more than 15"),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await apiRequest.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      updateUser(res.data.user);
    } catch (err) {
      setError("root", { message: err.response.data.message });
    }
  };

  return (
    <div className="registerPage flex h-full">
      <PageTitle title={"Register"} />
      {/* FORM */}
      <div className="formContainer flex-3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full max-w-md px-5"
        >
          <h1 className="text-3xl font-semibold text-center">
            Create an Account
          </h1>
          {registerForm.map((b, i) => (
            <div className="flex flex-col gap-1" key={i}>
              <input
                {...register(b.name)}
                type={b.type}
                placeholder={b.placeholder}
                className="py-3 px-2 border border-gray-400 rounded-md focus:outline-none"
              />
              {errors[b.name] && (
                <div className="text-red-500">{errors[b.name].message}</div>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`p-3 rounded-md font-bold text-white cursor-pointer ${
              isSubmitting
                ? "bg-teal-200 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            Register
          </button>

          {errors.root && (
            <span className="text-red-500">{errors.root.message}</span>
          )}

          <Link
            to="/login"
            className="text-sm text-gray-500 border-b border-gray-500 w-max"
          >
            Do you have an account?
          </Link>
        </form>
      </div>

      {/* IMAGE */}
      <div className="imgContainer flex-2 bg-[#fcf5f3] items-center justify-center hidden md:flex">
        <img src="/bg.png" alt="register" className="w-full" />
      </div>
    </div>
  );
}

export default Register;
