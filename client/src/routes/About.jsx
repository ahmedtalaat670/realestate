import PageTitle from "@/components/PageTitle";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen text-gray-800 pb-20">
      <PageTitle
        title={"About"}
        description={
          "this is about page of realestate website the best way to buy or rent or sell realstate units"
        }
      />
      {/* ===================== HERO ===================== */}
      <BlurFade>
        <section className="pt-24 pb-16 text-center">
          <TextAnimate
            animation="slideUp"
            className="text-5xl font-bold text-(--primary-color)"
            once
          >
            Discover Who We Are
          </TextAnimate>

          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            A modern real estate agency blending technology, expertise, and
            personalized service to help you find your perfect property.
          </p>
        </section>
      </BlurFade>
      <div className="container mx-auto px-4 space-y-24">
        {/* ===================== STORY SECTION ===================== */}
        <BlurFade delay={0.5}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="../../office.jfif"
              className="rounded-xl shadow-lg w-full"
            />

            <div>
              <h2 className="text-3xl font-semibold text-(--secondary-color)">
                Our Story
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                For more than a decade, we’ve helped families and investors
                navigate the real estate market with confidence and ease. We
                combine innovation, deep knowledge, and transparency to deliver
                results our clients trust.
              </p>
            </div>
          </div>
        </BlurFade>
        {/* ===================== GALLERY ===================== */}
        <BlurFade inView delay={1}>
          <h2 className="text-3xl font-semibold text-center text-(--secondary-color) mb-10">
            Property Gallery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <GalleryImage key={idx} index={idx} />
            ))}
          </div>
        </BlurFade>

        {/* ===================== CTA ===================== */}
        <BlurFade delay={1.5}>
          <section className="text-center mt-16">
            <h2 className="text-3xl font-semibold text-(--secondary-color) mb-4">
              Ready to Find Your Dream Home?
            </h2>

            <Button
              onClick={() => nav("/list")}
              className="cursor-pointer px-8 py-4 text-lg bg-(--primary-color) hover:bg-(--primary-color-hover) text-white"
            >
              Get Started Today
            </Button>
          </section>
        </BlurFade>
      </div>
    </div>
  );
}

/* ============================================================
   REUSABLE COMPONENTS
   ============================================================ */

// On-scroll wrapper component

// Gallery Image Component
function GalleryImage({ index }) {
  return (
    <div className="overflow-hidden rounded-xl shadow-md group">
      <img
        src={`../../gallery-${index + 1}.jfif`}
        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 hover:rotate-3"
        loading="lazy"
      />
    </div>
  );
}
