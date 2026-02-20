import PageTitle from "@/components/PageTitle";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function ContactPage() {
  const formSchema = z.object({
    name: z.string().min(3, "the name length must be more than 2"),
    email: z.string().email(),
    message: z.string().min(1, "you must specify the message"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div className="flex items-center flex-col md:flex-row justify-center bg-secondary-50 gap-5 w-full h-full">
      <PageTitle
        title={"Contact-Us"}
        description={
          "this is the contact-us page of realstate website to contact the work team to answer all your questions"
        }
      />
      {/* Titlle*/}
      <BlurFade inView>
        <AnimatedGradientText
          className="text-4xl font-extrabold text-center mb-10"
          gradientFrom="#fece51"
          gradientTo="teal"
        >
          Get in Touch
        </AnimatedGradientText>
      </BlurFade>

      {/* Contact Form Card */}
      <BlurFade inView delay={0.5}>
        <MagicCard
          gradientColor="#fece51"
          className="rounded-2xl shadow-xl p-px w-[calc(100vw-20px)] md:w-[500px]"
        >
          <Card className="w-full py-3 px-1">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold text-(--primary-color)">
                Contact Our Real Estate Team
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center items-center gap-4 w-full"
              >
                <div className="flex gap-3 w-full flex-col md:flex-row">
                  <div className="flex flex-col gap-2 flex-1">
                    <label
                      htmlFor="name"
                      className="capitalize text-gray-600 text-lg"
                    >
                      name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="enter your name"
                      className="p-2 border border-(--secondary-color) focus:outline-none rounded-md placeholder:capitalize caret-(--secondary-color) placeholder:text-gray-400"
                    />
                    {errors.name && (
                      <div className="text-red-500">{errors.name.message}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label
                      htmlFor="email"
                      className="capitalize text-gray-600 text-lg"
                    >
                      email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="p-2 border border-(--secondary-color) focus:outline-none rounded-md placeholder:capitalize caret-(--secondary-color) placeholder:text-gray-400"
                      placeholder="enter your email"
                    />
                    {errors.email && (
                      <div className="text-red-500">{errors.email.message}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="message"
                    className="capitalize text-gray-600 text-lg"
                  >
                    message
                  </label>
                  <textarea
                    className="p-2 w-full border border-(--secondary-color) focus:outline-none rounded-md placeholder:capitalize caret-(--secondary-color) placeholder:text-gray-400 resize-none"
                    rows={8}
                    {...register("message")}
                    placeholder="enter your message"
                  />
                  {errors.message && (
                    <div className="text-red-500">{errors.message.message}</div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-(--secondary-color) hover:bg-(--secondary-color-hover) rounded-md text-white capitalize font-semibold text-lg cursor-pointer"
                >
                  send message
                </button>
              </form>
            </CardContent>
          </Card>
        </MagicCard>
      </BlurFade>
    </div>
  );
}
