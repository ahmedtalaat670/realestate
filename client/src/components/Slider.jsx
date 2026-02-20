import { useEffect, useRef, useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const rightArrowRef = useRef();
  const leftArrowRef = useRef();
  const closeButtonRef = useRef();

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (imageIndex >= 0) {
        if (e.key === "ArrowRight") {
          rightArrowRef.current.click();
        } else if (e.key === "ArrowLeft") {
          leftArrowRef.current.click();
        } else if (e.key === "Escape") {
          closeButtonRef.current.click();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageIndex]);
  return (
    <div className="w-full flex gap-5 h-[350px] sm:h-[280px] relative">
      {/* Fullscreen overlay */}
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black flex justify-between items-center z-9999">
          {/* Left arrow */}
          <div
            className="flex-1 flex items-center justify-center cursor-pointer"
            onClick={() => changeSlide("left")}
            ref={leftArrowRef}
          >
            <img
              src="/arrow.png"
              alt="left"
              className="w-[50px] md:w-[30px] sm:w-5"
            />
          </div>

          {/* Image */}
          <div className="w-[80vw] h-[50vh] md:h-[80vh]">
            <img
              src={images[imageIndex]?.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right arrow */}
          <div
            className="flex-1 flex items-center justify-center cursor-pointer"
            onClick={() => changeSlide("right")}
            ref={rightArrowRef}
          >
            <img
              src="/arrow.png"
              alt="right"
              className="w-[50px] md:w-[30px] sm:w-5 rotate-180"
            />
          </div>

          {/* Close button */}
          <div
            className="absolute top-0 right-0 text-white text-[36px] font-bold p-[50px] cursor-pointer"
            onClick={() => setImageIndex(null)}
            ref={closeButtonRef}
          >
            ×
          </div>
        </div>
      )}

      {/* Big Image */}
      <div className="flex-2 md:flex-3 h-full cursor-pointer">
        <img
          src={images?.[0]?.imageUrl}
          alt=""
          className="w-full h-full object-cover rounded-xl"
          onClick={() => setImageIndex(0)}
        />
      </div>

      {/* Small Images */}
      <div className="flex-1 flex flex-col h-full justify-between gap-5">
        {images?.slice(1).map((img, idx) => (
          <img
            key={idx}
            src={img?.imageUrl}
            alt=""
            className="h-[100px] sm:h-20 w-full object-cover rounded-xl cursor-pointer"
            onClick={() => setImageIndex(idx + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
