import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const nav = useNavigate();
  return (
    <div>
      <div className="w-full flex justify-center">
        <img src="/404.png" alt="Page is not Found image" />
      </div>
      <div className="h-[50vh] w-full flex justify-center items-center flex-col gap-10">
        <p className="font-semibold text-[17px] text-[#565872] tracking-[4px] uppercase">
          opps! page not found
        </p>
        <button
          className="py-5 px-8 p bg-(--primary-color) hover:bg-(--primary-color-hover) text-white rounded-4xl uppercase cursor-pointer"
          onClick={() => nav("/")}
        >
          back to home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
