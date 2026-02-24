import PageTitle from "@/components/PageTitle";
import SearchBar from "@/components/SearchBar";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TypingAnimation } from "@/components/ui/typing-animation";

function HomePage() {
  return (
    <div className="homePage flex h-full pt-5">
      <PageTitle
        title={"Home"}
        description={
          "this is the home page of the realstate website the best web to buy or rent or sell realestate units "
        }
      />
      {/* Text Section */}
      <div className="textContainer flex-3 flex flex-col justify-center gap-12 sm:gap-6 sm:justify-start">
        <div className="wrapper flex flex-col gap-12 sm:gap-6 px-6">
          <h1 className="title text-6xl lg:text-5xl font-bold">
            <TypingAnimation typeSpeed={50}>
              Find Real Estate & Get Your Dream Place
            </TypingAnimation>
          </h1>
          <SearchBar />

          {/* Boxes */}
          <div className="boxes flex flex-row flex-wrap justify-between gap-6 mt-5">
            <div className="box text-center">
              <h1 className="text-4xl lg:text-3xl font-bold">
                <NumberTicker value={16} />+
              </h1>
              <h2 className="text-xl font-light">Years of Experience</h2>
            </div>
            <div className="box text-center">
              <h1 className="text-4xl lg:text-3xl font-bold">
                <NumberTicker value={200} />
              </h1>
              <h2 className="text-xl font-light">Award Gained</h2>
            </div>
            <div className="box text-center">
              <h1 className="text-4xl lg:text-3xl font-bold">
                <NumberTicker value={2000} />+
              </h1>
              <h2 className="text-xl font-light">Property Ready</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-2 relative hidden lg:flex h-[calc(100vh-100px)] items-center bg-(--primary-bg-color)">
        <img
          src="/bg.png"
          alt="Background"
          className="absolute right-0 w-[115%] lg:w-[105%] object-cover"
        />
      </div>
    </div>
  );
}

export default HomePage;
